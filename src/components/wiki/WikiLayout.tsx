"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import WikiSidebar from "./WikiSidebar"
import WikiToc from "./WikiToc"
import WikiSearch from "./WikiSearch"

interface WikiLayoutProps {
  title: string
  summary?: string
  headings: { text: string; level: number }[]
  editUrl: string
  created?: string
  updated?: string
  image?: string | null
  children: ReactNode
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function WikiLayout({
  title,
  summary,
  headings,
  editUrl,
  created,
  updated,
  image,
  children,
}: WikiLayoutProps) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur">
        <div className="flex h-12 items-center gap-3 px-3 sm:px-4">
          <button
            type="button"
            className="p-1 text-[#c9d1d9] md:hidden"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="font-serif text-lg text-[#f0f6fc] no-underline">
            Tutla Wiki
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block">
              <WikiSearch />
            </div>
            <a
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm text-[#79c0ff] no-underline hover:underline sm:inline"
            >
              Edit
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Left sidebar (desktop) */}
        <aside className="hidden w-44 shrink-0 border-r border-[#21262d] px-4 py-5 md:block">
          <WikiSidebar />
        </aside>

        {/* Article */}
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-8">
          {/* Article tabs */}
          <div className="mb-1 flex items-center gap-4 border-b border-[#21262d] text-sm">
            <span className="border-b-2 border-[#388bfd] pb-1 font-medium text-[#f0f6fc]">
              Article
            </span>
            <a
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pb-1 text-[#79c0ff] no-underline hover:underline"
            >
              Edit source
            </a>
          </div>

          <h1 className="mb-1 border-b border-[#21262d] pb-1 font-serif text-[28px] font-normal leading-tight text-[#f0f6fc]">
            {title}
          </h1>

          {/* small screens: search */}
          <div className="mb-4 sm:hidden">
            <WikiSearch />
          </div>

          <div className="lg:flex lg:gap-6">
            <div className="min-w-0 flex-1">
              <WikiToc headings={headings} />

              {/* Infobox */}
              {(image || summary) && (
                <figure className="float-none mb-4 w-full border border-[#30363d] bg-[#161b22] p-2 text-sm sm:float-right sm:ml-4 sm:w-64">
                  <figcaption className="mb-2 text-center font-bold text-[#f0f6fc]">
                    {title}
                  </figcaption>
                  {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={title}
                      className="mx-auto mb-2 max-w-full border border-[#30363d]"
                    />
                  )}
                  {summary && <p className="text-[#8b949e]">{summary}</p>}
                  {(created || updated) && (
                    <table className="mt-2 w-full border-collapse text-xs text-[#c9d1d9]">
                      <tbody>
                        {created && (
                          <tr className="border-t border-[#30363d]">
                            <th className="py-1 pr-2 text-left align-top font-semibold">Created</th>
                            <td className="py-1">{fmt(created)}</td>
                          </tr>
                        )}
                        {updated && updated !== created && (
                          <tr className="border-t border-[#30363d]">
                            <th className="py-1 pr-2 text-left align-top font-semibold">Updated</th>
                            <td className="py-1">{fmt(updated)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </figure>
              )}

              <article
                className="prose prose-invert max-w-none font-sans text-[15px] leading-relaxed
                  prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#f0f6fc]
                  prose-h2:border-b prose-h2:border-[#21262d] prose-h2:pb-1 prose-h2:scroll-mt-16
                  prose-a:text-[#79c0ff] prose-a:no-underline hover:prose-a:underline"
              >
                {children}
              </article>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setNavOpen(false)} />
          <div className="relative z-10 h-full w-64 overflow-y-auto border-r border-[#21262d] bg-[#0d1117] p-4">
            <button
              type="button"
              className="mb-3 ml-auto flex p-1 text-[#c9d1d9]"
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <WikiSidebar />
          </div>
        </div>
      )}
    </div>
  )
}
