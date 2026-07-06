"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { DocNode } from "@/lib/docs"
import { normalizeToSlug } from "@/lib/nav"
import { ChevronRight, FileText, Hash } from "lucide-react"

interface DocSidebarProps {
  title: string
  docsTree?: DocNode[] | null
  currentSlug: string
}

function TreeNode({
  node,
  currentSlug,
  depth,
}: {
  node: DocNode
  currentSlug: string
  depth: number
}) {
  if (node.isDir && node.children) {
    const containsActive = node.children.some((c) =>
      subtreeHasSlug(c, currentSlug)
    )
    return (
      <GroupNode node={node} currentSlug={currentSlug} depth={depth} defaultOpen={containsActive} />
    )
  }

  const slug = normalizeToSlug(node.path)
  const isActive = slug === currentSlug
  return (
    <Link
      href={slug}
      className={`group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm no-underline transition-colors ${
        isActive
          ? "bg-[#388bfd]/15 text-[#79c0ff] font-medium"
          : "text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]"
      }`}
      style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
    >
      <FileText
        size={14}
        className={`flex-shrink-0 ${isActive ? "text-[#388bfd]" : "text-[#484f58] group-hover:text-[#8b949e]"}`}
      />
      <span className="truncate capitalize">{node.name.replace(/-/g, " ")}</span>
    </Link>
  )
}

function GroupNode({
  node,
  currentSlug,
  depth,
  defaultOpen,
}: {
  node: DocNode
  currentSlug: string
  depth: number
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  useEffect(() => {
    if (defaultOpen) setOpen(true)
  }, [defaultOpen])

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[13px] font-semibold uppercase tracking-wide text-[#c9d1d9] transition-colors hover:bg-[#161b22]"
        style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
      >
        <ChevronRight
          size={13}
          className={`flex-shrink-0 text-[#484f58] transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
        <span className="truncate capitalize">{node.name.replace(/-/g, " ")}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-[13px] border-l border-[#21262d] pl-1">
          {node.children!.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              currentSlug={currentSlug}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function subtreeHasSlug(node: DocNode, slug: string): boolean {
  if (!node.isDir) return normalizeToSlug(node.path) === slug
  return (node.children ?? []).some((c) => subtreeHasSlug(c, slug))
}

export default function DocSidebar({ title, docsTree, currentSlug }: DocSidebarProps) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Documentation">
      <Link
        href={docsTree ? normalizeToSlug(currentSlug.split("/").slice(0, 2).join("/")) : "/"}
        className="mb-3 flex items-center gap-2 rounded-md px-2 py-2 text-sm font-bold text-[#f0f6fc] no-underline transition-colors hover:bg-[#161b22]"
      >
        <span className="grid h-6 w-6 place-items-center rounded bg-[#388bfd]/15 text-[#388bfd]">
          <Hash size={14} />
        </span>
        <span className="truncate">{title}</span>
      </Link>

      {docsTree?.map((node) => (
        <TreeNode key={node.path} node={node} currentSlug={currentSlug} depth={0} />
      ))}
    </nav>
  )
}
