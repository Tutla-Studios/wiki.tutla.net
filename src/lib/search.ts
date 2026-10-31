import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { getAllRemotePages, loadRemoteContent, remoteTitle } from "./github"

const CONTENT_ROOT = path.join(process.cwd(), "content")

function getAllMarkdownFiles(dir: string): string[] {
  let results: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath))
    } else if (entry.name.endsWith(".md")) {
      results.push(fullPath)
    }
  }
  return results
}

export async function makeSearchIndex() {
  const files = getAllMarkdownFiles(CONTENT_ROOT)
  const local = files.map((file) => {
    const raw = fs.readFileSync(file, "utf8")
    const { data, content } = matter(raw)
    const slug = file
      .replace(CONTENT_ROOT, "")
      .replace(/index\.md$/, "")
      .replace(/\.md$/, "")
      .replace(/\\/g, "/")

    return {
      title: data.title || slug,
      summary: data.summary || "",
      path: slug || "/",
      content,
    }
  })

  // GitHub-backed pages (github.txt mounts). Markdown only, to keep the index lean.
  const remote: typeof local = []
  const pages = (await getAllRemotePages()).filter((p) => p.isMarkdown)
  for (let i = 0; i < pages.length; i += 8) {
    const batch = await Promise.all(
      pages.slice(i, i + 8).map(async (p) => {
        const c = await loadRemoteContent(p)
        if (!c) return null
        return { title: remoteTitle(p, c), summary: String(c.data.summary ?? ""), path: p.slug, content: c.content }
      })
    )
    for (const b of batch) if (b) remote.push(b)
  }
  return [...local, ...remote]
}
