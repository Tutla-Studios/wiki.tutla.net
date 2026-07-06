"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Github, Globe, BookOpen } from "lucide-react"
import Search from "@/components/Search"
import DocSidebar from "./DocSidebar"
import { DocNode, SidebarLinks } from "@/lib/docs"

interface DocNavbarProps {
  title: string
  docsTree?: DocNode[] | null
  currentSlug: string
  links?: SidebarLinks
}

function ModrinthIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.252.004a11.78 11.768 0 0 0-8.92 3.73 11 10.999 0 0 0-2.17 3.11 11.37 11.359 0 0 0-1.16 5.169c0 1.42.17 2.5.6 3.77.24.759.77 1.899 1.17 2.529a12.3 12.298 0 0 0 8.85 5.639c.44.05 2.54.07 2.76.02.2-.04.22.1-.26-1.7l-.36-1.37-1.01-.06a8.5 8.489 0 0 1-5.18-1.8 5.34 5.34 0 0 1-1.3-1.26c0-.05.34-.28.74-.5a37.572 37.545 0 0 1 2.88-1.629c.03 0 .5.45 1.06.98l1 .97 2.07-.43 2.06-.43 1.47-1.47c.8-.8 1.48-1.5 1.48-1.52 0-.09-.42-1.63-.46-1.7-.04-.06-.2-.03-1.02.18-.53.13-1.2.3-1.45.4l-.48.15-.53.53-.53.53-.93.1-.93.07-.52-.5a2.7 2.7 0 0 1-.96-1.7l-.13-.6.43-.57c.68-.9.68-.9 1.46-1.1.4-.1.65-.2.83-.33.13-.099.65-.579 1.14-1.069l.9-.9-.7-.7-.7-.7-1.95.54c-1.07.3-1.96.53-1.97.53-.03 0-2.23 2.48-2.63 2.97l-.29.35.28 1.03c.16.56.3 1.16.31 1.34l.03.3-.34.23c-.37.23-2.22 1.3-2.84 1.63-.36.2-.37.2-.44.1-.08-.1-.23-.6-.32-1.03-.18-.86-.17-2.75.02-3.73a8.84 8.839 0 0 1 7.9-6.93c.43-.03.77-.08.78-.1.06-.17.5-2.999.47-3.039-.01-.02-.1-.02-.2-.03Zm3.68.67c-.2 0-.3.1-.37.38-.06.23-.46 2.42-.46 2.52 0 .04.1.11.22.16a8.51 8.499 0 0 1 2.99 2 8.38 8.379 0 0 1 2.16 3.449 6.9 6.9 0 0 1 .4 2.8c0 1.07 0 1.27-.1 1.73a9.37 9.369 0 0 1-1.76 3.769c-.32.4-.98 1.06-1.37 1.38-.38.32-1.54 1.1-1.7 1.14-.1.03-.1.06-.07.26.03.18.64 2.56.7 2.78l.06.06a12.07 12.058 0 0 0 7.27-9.4c.13-.77.13-2.58 0-3.4a11.96 11.948 0 0 0-5.73-8.578c-.7-.42-2.05-1.06-2.25-1.06Z" />
    </svg>
  )
}

const ICON_LINK_CLASS =
  "grid h-8 w-8 place-items-center rounded-md text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#c9d1d9]"

export default function DocNavbar({ title, docsTree, currentSlug, links }: DocNavbarProps) {
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
            {links?.website && (
              <a
                href={links.website}
                target="_blank"
                rel="noopener noreferrer"
                className={ICON_LINK_CLASS}
                aria-label="Website"
                title="Website"
              >
                <Globe size={18} />
              </a>
            )}
            {links?.modrinth && (
              <a
                href={links.modrinth}
                target="_blank"
                rel="noopener noreferrer"
                className={ICON_LINK_CLASS}
                aria-label="Modrinth"
                title="Modrinth"
              >
                <ModrinthIcon />
              </a>
            )}
            {links?.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={ICON_LINK_CLASS}
                aria-label="GitHub"
                title="GitHub"
              >
                <Github size={18} />
              </a>
            )}
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
