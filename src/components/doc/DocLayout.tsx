import Link from "next/link"
import { ReactNode } from "react"
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react"
import { DocNode } from "@/lib/docs"
import { getPrevNext } from "@/lib/nav"
import DocSidebar from "./DocSidebar"
import DocToc from "./DocToc"
import DocNavbar from "./DocNavbar"

interface DocLayoutProps {
  title: string
  docsTree?: DocNode[] | null
  currentSlug: string
  headings: { text: string; level: number }[]
  editUrl: string
  created?: string
  updated?: string
  breadcrumbs: string[]
  children: ReactNode
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function DocLayout({
  title,
  docsTree,
  currentSlug,
  headings,
  editUrl,
  created,
  updated,
  breadcrumbs,
  children,
}: DocLayoutProps) {
  const { prev, next } = getPrevNext(docsTree, currentSlug)

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <DocNavbar title={title} docsTree={docsTree} currentSlug={currentSlug} />

      <div className="mx-auto flex w-full max-w-[90rem]">
        {/* Left sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-[#21262d] px-3 py-6 lg:block">
          <DocSidebar title={title} docsTree={docsTree} currentSlug={currentSlug} />
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-6 py-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            {breadcrumbs.length > 0 && (
              <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-[#8b949e]">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="capitalize">{crumb.replace(/-/g, " ")}</span>
                    {i < breadcrumbs.length - 1 && (
                      <ChevronRight size={11} className="text-[#484f58]" />
                    )}
                  </span>
                ))}
              </nav>
            )}

            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#f0f6fc]">
              {title}
            </h1>

            {(created || updated) && (
              <p className="mb-8 flex gap-4 text-sm text-[#8b949e]">
                {created && <time dateTime={created}>Created {fmt(created)}</time>}
                {updated && updated !== created && (
                  <time dateTime={updated}>Updated {fmt(updated)}</time>
                )}
              </p>
            )}

            <article className="prose prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-[#79c0ff] prose-a:no-underline hover:prose-a:underline">
              {children}
            </article>

            {/* Prev / Next */}
            {(prev || next) && (
              <div className="mt-12 grid grid-cols-1 gap-4 border-t border-[#21262d] pt-6 sm:grid-cols-2">
                {prev ? (
                  <Link
                    href={prev.slug}
                    className="group flex flex-col rounded-lg border border-[#21262d] px-4 py-3 no-underline transition-colors hover:border-[#388bfd]/50 hover:bg-[#161b22]"
                  >
                    <span className="flex items-center gap-1 text-xs text-[#8b949e]">
                      <ChevronLeft size={13} /> Previous
                    </span>
                    <span className="mt-1 truncate font-medium capitalize text-[#c9d1d9] group-hover:text-[#79c0ff]">
                      {prev.name.replace(/-/g, " ")}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link
                    href={next.slug}
                    className="group flex flex-col items-end rounded-lg border border-[#21262d] px-4 py-3 text-right no-underline transition-colors hover:border-[#388bfd]/50 hover:bg-[#161b22] sm:col-start-2"
                  >
                    <span className="flex items-center gap-1 text-xs text-[#8b949e]">
                      Next <ChevronRight size={13} />
                    </span>
                    <span className="mt-1 truncate font-medium capitalize text-[#c9d1d9] group-hover:text-[#79c0ff]">
                      {next.name.replace(/-/g, " ")}
                    </span>
                  </Link>
                )}
              </div>
            )}

            <div className="mt-8">
              <a
                href={editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#8b949e] no-underline transition-colors hover:text-[#79c0ff]"
              >
                <Pencil size={14} /> Edit this page on GitHub
              </a>
            </div>
          </div>
        </main>

        {/* Right TOC */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto px-4 py-8 xl:block">
          <DocToc headings={headings} />
        </aside>
      </div>
    </div>
  )
}
