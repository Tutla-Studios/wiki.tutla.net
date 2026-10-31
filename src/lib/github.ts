import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { DocNode } from "./docs"

// ─── GitHub-backed content ───────────────────────────────────────────────────
// Any directory under /content that contains a `github.txt` file is a "mount".
// github.txt holds a GitHub folder URL, e.g.
//   https://github.com/Tutla-Studios/tums/tree/main/src
// The whole folder (recursively) is fetched at build / revalidate time and
// exposed as virtual pages under that directory's route. Optionally set
// GITHUB_TOKEN to raise rate limits or read private repos.

const CONTENT_ROOT = path.join(process.cwd(), "content")
const REVALIDATE = 3600
const MAX_FILE_BYTES = 300_000

export const GITHUB_FILE = "github.txt"

export interface GithubMount {
  /** Route parts of the mount, e.g. ["tums", "source"] */
  parts: string[]
  prefix: string // "/tums/source"
  owner: string
  repo: string
  ref: string
  subpath: string // "" or "src"
  url: string
}

export interface RemotePage {
  slug: string // "/tums/source/foo/bar" (original case)
  key: string // lowercase slug for lookups
  mount: GithubMount
  repoPath: string // path within repo
  relPath: string // path relative to the mount subpath
  isMarkdown: boolean
  isIndex: boolean
  title: string
  size: number
}

export interface RemoteContent {
  data: Record<string, unknown>
  content: string // markdown (code files wrapped in a fence)
}

// ─── Mount discovery ─────────────────────────────────────────────────────────

export function parseGithubUrl(raw: string): Omit<GithubMount, "parts" | "prefix"> | null {
  const m = raw
    .trim()
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "")
    .match(/^https?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/(?:tree|blob)\/([^/]+)(?:\/(.*))?)?$/)
  if (!m) return null
  const [, owner, repo, ref, sub] = m
  return { owner, repo, ref: ref || "HEAD", subpath: (sub || "").replace(/^\/+|\/+$/g, ""), url: raw.trim() }
}

let mountCache: GithubMount[] | null = null

export function findGithubMounts(): GithubMount[] {
  if (mountCache && process.env.NODE_ENV === "production") return mountCache
  const mounts: GithubMount[] = []

  function walk(dir: string, parts: string[]) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    if (entries.some((e) => e.isFile() && e.name === GITHUB_FILE) && parts.length > 0) {
      try {
        const first = fs
          .readFileSync(path.join(dir, GITHUB_FILE), "utf8")
          .split(/\r?\n/)
          .map((l) => l.trim())
          .find((l) => l && !l.startsWith("#"))
        const parsed = first ? parseGithubUrl(first) : null
        if (parsed) mounts.push({ ...parsed, parts, prefix: "/" + parts.join("/") })
        else console.warn(`Invalid ${GITHUB_FILE} in ${dir}`)
      } catch (e) {
        console.error(`Error reading ${GITHUB_FILE} in ${dir}:`, e)
      }
    }
    for (const e of entries) {
      if (e.isDirectory() && !e.name.startsWith(".")) walk(path.join(dir, e.name), [...parts, e.name])
    }
  }

  walk(CONTENT_ROOT, [])
  mountCache = mounts
  return mounts
}

export function findMountsForProject(project: string): GithubMount[] {
  return findGithubMounts().filter((m) => m.parts[0].toLowerCase() === project.toLowerCase())
}

// ─── Fetching ────────────────────────────────────────────────────────────────

function headers(): Record<string, string> {
  const h: Record<string, string> = { "User-Agent": "wiki.tutla.net", Accept: "application/vnd.github+json" }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

const TEXT_EXT = new Set([
  "md", "mdx", "txt", "json", "yml", "yaml", "toml", "xml", "html", "css", "scss", "js", "jsx", "ts", "tsx",
  "mjs", "cjs", "java", "kt", "kts", "py", "rs", "go", "c", "h", "cpp", "hpp", "cs", "rb", "php", "sh",
  "bash", "zsh", "gradle", "properties", "lua", "sql", "ini", "cfg", "conf", "tsn", "mcmeta", "svelte", "vue",
])
const TEXT_NAMES = new Set(["license", "dockerfile", "makefile", "readme", "changelog", ".gitignore"])

function isTextFile(p: string): boolean {
  const base = p.split("/").pop() || ""
  const dot = base.lastIndexOf(".")
  if (dot > 0) return TEXT_EXT.has(base.slice(dot + 1).toLowerCase())
  return TEXT_NAMES.has(base.toLowerCase())
}

function slugSegment(s: string): string {
  return s
}

interface TreeEntry { path: string; type: string; size?: number }

const pageCache = new Map<string, Promise<RemotePage[]>>()

async function fetchMountPages(mount: GithubMount): Promise<RemotePage[]> {
  const api = `https://api.github.com/repos/${mount.owner}/${mount.repo}/git/trees/${encodeURIComponent(mount.ref)}?recursive=1`
  const res = await fetch(api, { headers: headers(), next: { revalidate: REVALIDATE } })
  if (!res.ok) throw new Error(`GitHub tree request failed (${res.status}) for ${mount.url}`)
  const json = (await res.json()) as { tree: TreeEntry[]; truncated?: boolean }
  if (json.truncated) console.warn(`GitHub tree truncated for ${mount.url}; some files may be missing`)

  const base = mount.subpath ? mount.subpath + "/" : ""
  const pages: RemotePage[] = []
  const seen = new Set<string>()

  for (const entry of json.tree) {
    if (entry.type !== "blob" || !entry.path.startsWith(base)) continue
    const rel = entry.path.slice(base.length)
    if (!rel || rel.split("/").some((s) => s.startsWith("."))) continue
    if (!isTextFile(rel) || (entry.size ?? 0) > MAX_FILE_BYTES) continue

    const isMarkdown = /\.(md|mdx)$/i.test(rel)
    const segs = rel.split("/")
    const file = segs[segs.length - 1]
    const stem = file.replace(/\.(md|mdx)$/i, "")
    const isIndex = isMarkdown && /^(index|readme)$/i.test(stem)

    const slugSegs = isMarkdown ? (isIndex ? segs.slice(0, -1) : [...segs.slice(0, -1), stem]) : segs
    const slug = "/" + [...mount.parts, ...slugSegs.map(slugSegment)].join("/")
    const key = slug.toLowerCase()
    // index.md wins over README.md if both exist
    if (seen.has(key)) {
      if (!(isIndex && /^index$/i.test(stem))) continue
      const i = pages.findIndex((p) => p.key === key)
      if (i !== -1) pages.splice(i, 1)
    }
    seen.add(key)
    pages.push({
      slug, key, mount, repoPath: entry.path, relPath: rel, isMarkdown, isIndex,
      title: isIndex ? (segs.length > 1 ? segs[segs.length - 2] : mount.parts[mount.parts.length - 1]) : isMarkdown ? stem : file,
      size: entry.size ?? 0,
    })
  }
  return pages
}

export function getMountPages(mount: GithubMount): Promise<RemotePage[]> {
  let p = pageCache.get(mount.prefix)
  if (!p) {
    p = fetchMountPages(mount).catch((e) => {
      console.error(`Error fetching GitHub mount ${mount.url}:`, e)
      pageCache.delete(mount.prefix) // retry next time
      return []
    })
    pageCache.set(mount.prefix, p)
  }
  return p
}

export async function getAllRemotePages(): Promise<RemotePage[]> {
  const all = await Promise.all(findGithubMounts().map(getMountPages))
  return all.flat()
}

export async function findRemotePage(slugParts: string[]): Promise<RemotePage | null> {
  const key = "/" + slugParts.filter((s) => s !== "index").join("/").toLowerCase()
  const mount = findGithubMounts().find((m) => key === m.prefix.toLowerCase() || key.startsWith(m.prefix.toLowerCase() + "/"))
  if (!mount) return null
  const pages = await getMountPages(mount)
  return pages.find((p) => p.key === key) ?? null
}

// ─── Content ─────────────────────────────────────────────────────────────────

const contentCache = new Map<string, Promise<string | null>>()

function fetchRaw(page: RemotePage): Promise<string | null> {
  const { owner, repo, ref } = page.mount
  const id = `${owner}/${repo}@${ref}:${page.repoPath}`
  let p = contentCache.get(id)
  if (!p) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(ref)}/${page.repoPath.split("/").map(encodeURIComponent).join("/")}`
    p = fetch(url, { headers: headers(), next: { revalidate: REVALIDATE } })
      .then((r) => (r.ok ? r.text() : null))
      .catch(() => null)
    p = p.then((t) => {
      if (t === null) contentCache.delete(id)
      return t
    })
    contentCache.set(id, p)
  }
  return p
}

// GitHub edit link for the source file (non-collaborators are prompted to fork).
// "HEAD" is not a valid edit ref, so fall back to the read-only blob view.
export function githubBlobUrl(page: RemotePage): string {
  const { owner, repo, ref } = page.mount
  const mode = ref === "HEAD" ? "blob" : "edit"
  return `https://github.com/${owner}/${repo}/${mode}/${ref}/${page.repoPath}`
}

function rawUrl(page: RemotePage, repoPath: string): string {
  const { owner, repo, ref } = page.mount
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${repoPath}`
}

// Rewrite repo-relative links/images in markdown so they work on the wiki.
function rewriteLinks(md: string, page: RemotePage, pages: RemotePage[]): string {
  const dir = page.repoPath.split("/").slice(0, -1)
  return md.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (full, bang, text, url, title) => {
    if (/^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(url)) return full
    let target: string[]
    const [urlPath, hash] = url.split("#")
    if (urlPath.startsWith("/")) target = urlPath.split("/").filter(Boolean)
    else {
      target = [...dir]
      for (const seg of urlPath.split("/")) {
        if (seg === "..") target.pop()
        else if (seg && seg !== ".") target.push(seg)
      }
    }
    const repoPath = target.join("/")
    if (bang) return `![${text}](${rawUrl(page, repoPath)}${title})`
    const hit = pages.find((p) => p.repoPath === repoPath)
    if (hit) return `[${text}](${hit.slug}${hash ? "#" + hash : ""}${title})`
    const { owner, repo, ref } = page.mount
    return `[${text}](https://github.com/${owner}/${repo}/blob/${ref}/${repoPath}${hash ? "#" + hash : ""}${title})`
  })
}

export async function loadRemoteContent(page: RemotePage): Promise<RemoteContent | null> {
  const raw = await fetchRaw(page)
  if (raw === null) return null

  if (page.isMarkdown) {
    const { data, content } = matter(raw)
    const pages = await getMountPages(page.mount)
    return { data, content: rewriteLinks(content, page, pages) }
  }

  const ext = (page.relPath.split(".").pop() || "").toLowerCase()
  const longest = Math.max(2, ...(raw.match(/`+/g) || []).map((s) => s.length))
  const fence = "`".repeat(longest + 1)
  return { data: {}, content: `${fence}${ext === "tsn" ? "" : ext}\n${raw.replace(/\n$/, "")}\n${fence}\n` }
}

export function remoteTitle(page: RemotePage, content: RemoteContent): string {
  if (content.data.title) return String(content.data.title)
  const h1 = content.content.match(/^#\s+(.+)$/m)
  if (page.isMarkdown && h1) return h1[1].trim()
  return page.title
}

// ─── Sidebar tree ────────────────────────────────────────────────────────────

export function buildRemoteTree(pages: RemotePage[], mount: GithubMount): DocNode[] {
  interface Dir { dirs: Map<string, Dir>; files: RemotePage[]; index?: RemotePage }
  const root: Dir = { dirs: new Map(), files: [] }

  for (const p of pages) {
    const segs = p.relPath.split("/")
    let cur = root
    for (const seg of segs.slice(0, -1)) {
      if (!cur.dirs.has(seg)) cur.dirs.set(seg, { dirs: new Map(), files: [] })
      cur = cur.dirs.get(seg)!
    }
    if (p.isIndex) cur.index = p
    else cur.files.push(p)
  }

  const toNodes = (dir: Dir, dirParts: string[]): DocNode[] => {
    const nodes: DocNode[] = []
    if (dir.index) nodes.push({ name: "Overview", path: dir.index.slug, isDir: false })
    for (const f of [...dir.files].sort((a, b) => a.title.localeCompare(b.title))) {
      nodes.push({ name: f.title, path: f.slug, isDir: false })
    }
    for (const [name, d] of [...dir.dirs].sort((a, b) => a[0].localeCompare(b[0]))) {
      nodes.push({
        name,
        path: "/" + [...mount.parts, ...dirParts, name].join("/"),
        isDir: true,
        children: toNodes(d, [...dirParts, name]),
      })
    }
    return nodes
  }
  return toNodes(root, [])
}

// Append every GitHub mount of a project to its sidebar tree.
export async function appendRemoteTrees(tree: DocNode[], project: string): Promise<DocNode[]> {
  const mounts = findMountsForProject(project)
  if (mounts.length === 0) return tree

  const out = [...tree]
  const hasSlug = (nodes: DocNode[], prefix: string): boolean =>
    nodes.some((n) => (n.isDir && n.children ? hasSlug(n.children, prefix) : !n.isDir && n.path.toLowerCase().startsWith(prefix)))

  for (const mount of mounts) {
    const pages = await getMountPages(mount)
    if (pages.length === 0 || hasSlug(out, mount.prefix.toLowerCase() + "/")) continue
    const nodes = buildRemoteTree(pages, mount)
    if (mount.parts.length === 1) out.push(...nodes)
    else out.push({ name: mount.parts[mount.parts.length - 1], path: mount.prefix, isDir: true, children: nodes })
  }
  return out
}
