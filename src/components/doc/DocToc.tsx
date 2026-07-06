"use client"

import { useEffect, useState } from "react"
import { slugifyHeading } from "@/lib/nav"
import { AlignLeft } from "lucide-react"

interface DocTocProps {
  headings: { text: string; level: number }[]
}

export default function DocToc({ headings }: DocTocProps) {
  const items = headings.filter((h) => h.level >= 2 && h.level <= 4)
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (items.length === 0) return
    const ids = items.map((h) => slugifyHeading(h.text))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <div className="text-sm">
      <div className="mb-3 flex items-center gap-2 font-semibold text-[#c9d1d9]">
        <AlignLeft size={15} className="text-[#484f58]" />
        On this page
      </div>
      <ul className="space-y-0.5 border-l border-[#21262d]">
        {items.map((h, i) => {
          const id = slugifyHeading(h.text)
          const isActive = id === activeId
          return (
            <li key={i}>
              <a
                href={`#${id}`}
                className={`-ml-px block border-l-2 py-1 text-[13px] leading-snug transition-colors ${
                  isActive
                    ? "border-[#388bfd] text-[#79c0ff]"
                    : "border-transparent text-[#8b949e] hover:text-[#c9d1d9]"
                }`}
                style={{ paddingLeft: `${0.75 + (h.level - 2) * 0.75}rem` }}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
