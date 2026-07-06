"use client"

import { useEffect, useRef, useState } from "react"
import { Search as SearchIcon } from "lucide-react"

type Hit = { title: string; summary: string; path: string; snippetHtml: string }

export default function WikiSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Hit[]>([])
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const ctrl = useRef<AbortController | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    const id = setTimeout(async () => {
      ctrl.current?.abort()
      ctrl.current = new AbortController()
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: ctrl.current.signal,
        })
        const data: Hit[] = await res.json()
        setResults(data)
        setOpen(true)
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") console.error(err)
      }
    }, 150)
    return () => clearTimeout(id)
  }, [query])

  return (
    <div className="relative w-full max-w-xs" ref={boxRef}>
      <div className="flex items-stretch">
        <div className="relative flex-1">
          <SearchIcon
            size={14}
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#484f58]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setOpen(true)}
            placeholder="Search Tutla Wiki"
            className="w-full rounded-l-sm border border-[#30363d] bg-[#0d1117] py-1 pl-7 pr-2 text-sm text-[#c9d1d9] placeholder-[#484f58] outline-none focus:border-[#388bfd] focus:ring-1 focus:ring-[#388bfd]/30"
          />
        </div>
        <button
          type="button"
          className="rounded-r-sm border border-l-0 border-[#30363d] bg-[#161b22] px-2 text-[#8b949e] hover:bg-[#21262d] hover:text-[#c9d1d9]"
          aria-label="Search"
        >
          <SearchIcon size={14} />
        </button>
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-px max-h-80 overflow-y-auto border border-[#30363d] bg-[#161b22] shadow-2xl shadow-black/60">
          {results.map((hit) => (
            <a
              key={hit.path}
              href={hit.path}
              className="block border-b border-[#21262d] px-3 py-2 no-underline last:border-b-0 hover:bg-[#21262d]"
            >
              <div className="text-sm font-semibold text-[#79c0ff]">{hit.title}</div>
              <div
                className="mt-0.5 line-clamp-1 text-xs text-[#8b949e] [&_mark]:bg-[#f0883e]/20 [&_mark]:text-[#f0883e]"
                dangerouslySetInnerHTML={{ __html: hit.snippetHtml || hit.summary }}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
