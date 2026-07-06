import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { getMdxSource } from "@/lib/mdx"
import { readDocsDir, loadSidebarConfig } from "@/lib/docs"
import { normalizeToSlug, slugifyHeading } from "@/lib/nav"
import MdxRenderer from "@/components/MdxRenderer"
import DocLayout from "@/components/doc/DocLayout"
import WikiLayout from "@/components/wiki/WikiLayout"
import type { Metadata } from "next"

const CONTENT_ROOT = path.join(process.cwd(), "content")
const SITE_URL = "https://wiki.tutla.net"
const SITE_NAME = "Tutla Wiki"

// ─── Static params (SSG) ──────────────────────────────────────────────────────
// This tells Next.js to pre-render every .md file at build time.
// Result: static HTML files served instantly, no server needed, perfect for SEO.

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const params: { slug: string[] }[] = []

  function walk(dir: string, parts: string[] = []) {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath, [...parts, entry.name])
      } else if (entry.name.endsWith(".md")) {
        const name = entry.name.replace(/\.md$/, "")
        // index.md → serves as the directory route (e.g. /tutlamc)
        if (name === "index") {
          if (parts.length > 0) params.push({ slug: parts })
        } else {
          params.push({ slug: [...parts, name] })
        }
      }
    }
  }

  walk(CONTENT_ROOT)

  // Generated FAQ pages for any project whose sidebar.json defines an "faq".
  if (fs.existsSync(CONTENT_ROOT)) {
    for (const entry of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue
      const config = loadSidebarConfig(entry.name)
      if (config?.faq) params.push({ slug: [entry.name, "faq"] })
    }
  }

  // Also include root index
  params.push({ slug: ["index"] })

  return params
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveFilePath(slugParts: string[]): string | null {
  // Try exact match: /content/a/b/c.md
  const direct = path.join(CONTENT_ROOT, ...slugParts) + ".md"
  if (fs.existsSync(direct)) return direct

  // Try index: /content/a/b/c/index.md
  const index = path.join(CONTENT_ROOT, ...slugParts, "index.md")
  if (fs.existsSync(index)) return index

  return null
}

function getFirstImage(markdown: string): string | null {
  const match = markdown.match(/!\[.*?\]\((.*?)\)/)
  if (!match) return null
  const url = match[1]
  if (url.startsWith("http")) return url
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`
}

function getDocName(filePath: string): string {
  const parts = filePath.split(path.sep)
  const idx = parts.indexOf("content")
  return idx !== -1 && parts.length > idx + 1 ? parts[idx + 1] : ""
}

function findDocRoot(filePath: string): string | null {
  const clean = filePath.endsWith(".md") ? filePath.slice(0, -3) : filePath
  const dir = path.join(CONTENT_ROOT, getDocName(clean))
  const indexPath = path.join(dir, "index.md")
  if (fs.existsSync(indexPath)) {
    const { data } = matter(fs.readFileSync(indexPath, "utf8"))
    if (data.isdoc) return dir
  }
  return null
}

function getEditPath(filePath: string, slugParts: string[]): string {
  // If the file lives at /content/foo.md but is really content/foo/index.md, fix it
  if (
    filePath.startsWith(CONTENT_ROOT) &&
    path.dirname(filePath) === CONTENT_ROOT
  ) {
    const name = path.basename(filePath, ".md")
    return `content/${name}/index.md`
  }
  return filePath.replace(process.cwd() + path.sep, "").replace(/\\/g, "/")
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const slugParts = (resolvedParams.slug ?? ["index"]).map((s) => s.toLowerCase())

  const filePath = resolveFilePath(slugParts)
  if (!filePath) {
    if (slugParts.length === 2 && slugParts[1] === "faq" && loadSidebarConfig(slugParts[0])?.faq) {
      return {
        title: `FAQ — ${SITE_NAME}`,
        description: `Frequently asked questions about ${slugParts[0]}`,
        alternates: { canonical: `${SITE_URL}/${slugParts.join("/")}` },
      }
    }
    return { title: SITE_NAME }
  }

  const fileContent = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(fileContent)

  const canonicalUrl = `${SITE_URL}/${slugParts.filter((s) => s !== "index").join("/")}`
  const firstImage = getFirstImage(content)
  const title = data.title ? `${data.title} — ${SITE_NAME}` : SITE_NAME
  const description = data.summary || `${data.title} on ${SITE_NAME}`

  return {
    title,
    description,
    keywords: data.tags ?? [],
    authors: data.author ? [{ name: data.author }] : undefined,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: data.title ?? SITE_NAME,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: data.created,
      modifiedTime: data.updated,
      images: firstImage
        ? [{ url: firstImage, width: 1200, height: 630, alt: data.title }]
        : undefined,
    },

    twitter: {
      card: firstImage ? "summary_large_image" : "summary",
      title: data.title ?? SITE_NAME,
      description,
      images: firstImage ? [firstImage] : undefined,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function WikiPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  try {
    const resolvedParams = await params
    const slugParts = (resolvedParams.slug ?? ["index"]).map((s) => s.toLowerCase())

    const filePath = resolveFilePath(slugParts)

    // Generated FAQ page — no markdown file backs this route.
    if (!filePath && slugParts.length === 2 && slugParts[1] === "faq") {
      const config = loadSidebarConfig(slugParts[0])
      if (config?.faq) {
        const project = slugParts[0]
        const faqHeadings = Object.keys(config.faq).map((q) => ({ text: q, level: 2 }))
        return (
          <DocLayout
            title="FAQ"
            docsTree={config.tree}
            currentSlug={`/${project}/faq`}
            headings={faqHeadings}
            editUrl={`https://github.com/TutlaMC/wiki.tutla.net/tree/main/content/${project}/sidebar.json`}
            breadcrumbs={[project, "faq"]}
            links={config.links}
          >
            {Object.entries(config.faq).map(([question, answer]) => (
              <section key={question}>
                <h2 id={slugifyHeading(question)}>{question}</h2>
                <p>{answer}</p>
              </section>
            ))}
          </DocLayout>
        )
      }
    }

    if (!filePath) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-[#c9d1d9]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-[#8b949e]">Page not found</p>
          </div>
        </div>
      )
    }

    const fileContent = fs.readFileSync(filePath, "utf8")
    const { content, data } = matter(fileContent)
    const isDoc = Boolean(data.isdoc)

    const { mdxSource, headings } = await getMdxSource(content)
    const editPath = getEditPath(filePath, slugParts)
    const docRoot = isDoc ? findDocRoot(filePath) : null

    // Sidebar
    let docsTree = null
    let links = undefined
    if (slugParts[0]) {
      const sidebarConfig = loadSidebarConfig(slugParts[0])
      if (sidebarConfig) {
        docsTree = sidebarConfig.tree
        links = sidebarConfig.links
      } else if (docRoot) {
        docsTree = readDocsDir(docRoot)
      }
    }

    const firstImage = getFirstImage(content)
    const canonicalUrl = `${SITE_URL}/${slugParts.filter((s) => s !== "index").join("/")}`
    const currentSlug = normalizeToSlug(filePath)
    const breadcrumbs = slugParts.filter((s) => s !== "index")
    const editUrl = `https://github.com/TutlaMC/wiki.tutla.net/tree/main/${editPath}`
    const created = data.created ? String(data.created) : undefined
    const updated = data.updated ? String(data.updated) : undefined

    // JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.summary,
      url: canonicalUrl,
      ...(data.created && { datePublished: data.created }),
      ...(data.updated && { dateModified: data.updated }),
      ...(data.author && { author: { "@type": "Person", name: data.author } }),
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      ...(firstImage && { image: firstImage }),
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {isDoc ? (
          <DocLayout
            title={String(data.title)}
            docsTree={docsTree}
            currentSlug={currentSlug}
            headings={headings}
            editUrl={editUrl}
            created={created}
            updated={updated}
            breadcrumbs={breadcrumbs}
            links={links}
          >
            <MdxRenderer mdxSource={mdxSource} />
          </DocLayout>
        ) : (
          <WikiLayout
            title={String(data.title)}
            summary={data.summary ? String(data.summary) : undefined}
            headings={headings}
            editUrl={editUrl}
            created={created}
            updated={updated}
            image={firstImage}
          >
            <MdxRenderer mdxSource={mdxSource} />
          </WikiLayout>
        )}
      </>
    )
  } catch (error) {
    console.error("Error in WikiPage:", error)
    return (
      <div className="p-6 bg-red-900/20 text-red-300">
        <h1 className="text-2xl font-bold mb-4">Error Loading Page</h1>
        <p>There was an error loading this page.</p>
      </div>
    )
  }
}