"use client"

import { useState } from "react"
import { slugifyHeading } from "@/lib/nav"

interface WikiTocProps {
  headings: { text: string; level: number }[]
}

// Build Wikipedia-style hierarchical section numbers (1, 1.1, 2, …) from the
// heading levels, treating the shallowest present heading level as the top.
function numberHeadings(headings: { text: string; level: number }[]) {
  const minLevel = Math.min(...headings.map((h) => h.level))
  const counters: number[] = []
  return headings.map((h) => {
    const depth = h.level - minLevel
    counters.length = depth + 1
    counters[depth] = (counters[depth] ?? 0) + 1
    for (let i = depth + 1; i < counters.length; i++) counters[i] = 0
    const number = counters.slice(0, depth + 1).join(".")
    return { ...h, depth, number }
  })
}

export default function WikiToc({ headings }: WikiTocProps) {
  const items = headings.filter((h) => h.level >= 2 && h.level <= 4)
  const [hidden, setHidden] = useState(false)

  if (items.length === 0) return null
  const numbered = numberHeadings(items)

  return (
    <nav
      className="mb-4 inline-block min-w-[15rem] max-w-full border border-[#30363d] bg-[#161b22] p-3 text-sm"
      aria-label="Contents"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="font-bold text-[#f0f6fc]">Contents</span>
        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          className="text-xs text-[#79c0ff] hover:underline"
        >
          [{hidden ? "show" : "hide"}]
        </button>
      </div>
      {!hidden && (
        <ul className="space-y-1">
          {numbered.map((h, i) => (
            <li key={i} style={{ paddingLeft: `${h.depth * 1.25}rem` }}>
              <a
                href={`#${slugifyHeading(h.text)}`}
                className="flex gap-2 text-[#79c0ff] no-underline hover:underline"
              >
                <span className="text-[#8b949e]">{h.number}</span>
                <span>{h.text}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
