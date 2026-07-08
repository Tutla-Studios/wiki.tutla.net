import fs from "fs"
import path from "path"
import matter from "gray-matter"

export const revalidate = 3600

const CONTENT_ROOT = path.join(process.cwd(), "content")
const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://wiki.tutla.net"

type Page = { slug: string; title: string; summary: string }

function walk(dir: string, parts: string[] = []): Page[] {
  if (!fs.existsSync(dir)) return []
  const pages: Page[] = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      pages.push(...walk(fullPath, [...parts, entry.name]))
    } else if (entry.name.endsWith(".md")) {
      const name = entry.name.replace(/\.md$/, "")
      const slugParts = name === "index" ? parts : [...parts, name]
      const slug = slugParts.join("/")

      let title = slug || "Home"
      let summary = ""
      try {
        const { data } = matter(fs.readFileSync(fullPath, "utf8"))
        if (data.title) title = String(data.title)
        if (data.summary) summary = String(data.summary)
      } catch {}

      pages.push({ slug, title, summary })
    }
  }

  return pages
}

export async function GET() {
  const pages = walk(CONTENT_ROOT).sort((a, b) => a.slug.localeCompare(b.slug))

  // Group by top-level project (first slug segment).
  const groups = new Map<string, Page[]>()
  for (const page of pages) {
    const project = page.slug.split("/")[0] || "index"
    if (!groups.has(project)) groups.set(project, [])
    groups.get(project)!.push(page)
  }

  const sections = [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([project, projectPages]) => {
      const lines = projectPages
        .map((p) => {
          const url = `${BASE}/${p.slug}`
          const desc = p.summary ? ` — ${p.summary}` : ""
          return `- [${p.title}](${url})${desc}`
        })
        .join("\n")
      return `### ${project}\n${lines}`
    })
    .join("\n\n")

  const body = `# Tutla Wiki

> The official Tutla Wiki — documentation for Tutla plugins, mods, apps, developer tools, and libraries. Open-source and community-driven.

## Pages

- [Home](${BASE}/): Wiki landing page with search across all Tutla documentation.

## Documentation

${sections}

## External Links

- Website: https://tutla.net
- GitHub: https://github.com/TutlaMC
- Discord: https://discord.tutla.net
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Last-Modified": new Date().toUTCString(),
      "Cache-Control": "public, max-age=3600",
    },
  })
}
