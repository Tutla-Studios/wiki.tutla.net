"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Github, BookOpen } from "lucide-react"
import Search from "@/components/Search"
import DocSidebar from "./DocSidebar"
import { DocNode } from "@/lib/docs"

interface DocNavbarProps {
  title: string
  docsTree?: DocNode[] | null
  currentSlug: string
}

function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.2.36-.43.844-.59 1.23a18.27 18.27 0 0 0-5.6 0A12.3 12.3 0 0 0 9.1 3a19.74 19.74 0 0 0-4.432 1.37C1.7 8.78.964 13.07 1.33 17.3a19.9 19.9 0 0 0 6.06 3.06c.49-.67.926-1.38 1.3-2.13-.71-.27-1.39-.6-2.03-.99.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.08 0c.16.14.33.27.5.4-.64.39-1.32.72-2.03.99.374.75.81 1.46 1.3 2.13a19.85 19.85 0 0 0 6.06-3.06c.43-4.9-.735-9.15-3.19-12.93ZM8.02 14.7c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4s2.17 1.09 2.15 2.4c0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4s2.17 1.09 2.15 2.4c0 1.32-.94 2.4-2.15 2.4Z" />
    </svg>
  )
}

export default function DocNavbar({ title, docsTree, currentSlug }: DocNavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur">
        <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
          <button
            type="button"
            className="p-1 text-[#c9d1d9] lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight text-[#f0f6fc] no-underline"
          >
            <BookOpen size={18} className="text-[#388bfd]" />
            <span className="hidden sm:inline">Tutla Wiki</span>
          </Link>

          <div className="mx-auto hidden w-full max-w-md md:block">
            <Search />
          </div>

          <nav className="ml-auto flex items-center gap-1 md:ml-0">
            <a
              href="https://github.com/tutlamc"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-md text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#c9d1d9]"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://tutla.net/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-md text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#c9d1d9]"
              aria-label="Discord"
            >
              <DiscordIcon />
            </a>
          </nav>
        </div>

        {/* mobile search row */}
        <div className="border-t border-[#21262d] px-4 py-2 md:hidden">
          <Search />
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 h-full w-72 overflow-y-auto border-r border-[#21262d] bg-[#0d1117] p-4">
            <button
              type="button"
              className="mb-2 ml-auto flex p-1 text-[#c9d1d9]"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
            <DocSidebar title={title} docsTree={docsTree} currentSlug={currentSlug} />
          </div>
        </div>
      )}
    </>
  )
}
