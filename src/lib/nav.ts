import { DocNode } from "./docs"

// Normalize either an absolute content file path
// (…/content/tums/scripting/index.md) or an already-slugified sidebar.json
// value (/tums/scripting) into a canonical route slug (/tums/scripting).
export function normalizeToSlug(input: string): string {
  let s = input.replace(/\\/g, "/")

  const marker = "/content/"
  const idx = s.indexOf(marker)
  if (idx !== -1) {
    s = s.slice(idx + marker.length - 1) // keep leading slash
  } else if (s.startsWith("content/")) {
    s = s.slice("content".length)
  }

  s = s.replace(/\.md$/, "")
  s = s.replace(/\/index$/, "")
  if (!s.startsWith("/")) s = "/" + s
  s = s.replace(/\/{2,}/g, "/")
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1)
  return s
}

export interface FlatLeaf {
  name: string
  slug: string
}

// Depth-first list of every clickable leaf in a doc tree, in sidebar order.
// Used to compute previous / next page navigation.
export function flattenLeaves(nodes: DocNode[] | null | undefined): FlatLeaf[] {
  const out: FlatLeaf[] = []
  if (!nodes) return out

  for (const node of nodes) {
    if (node.isDir && node.children) {
      out.push(...flattenLeaves(node.children))
    } else if (!node.isDir) {
      out.push({ name: node.name, slug: normalizeToSlug(node.path) })
    }
  }
  return out
}

export interface PrevNext {
  prev: FlatLeaf | null
  next: FlatLeaf | null
}

export function getPrevNext(
  docsTree: DocNode[] | null | undefined,
  currentSlug: string
): PrevNext {
  const leaves = flattenLeaves(docsTree)
  const i = leaves.findIndex((l) => l.slug === currentSlug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? leaves[i - 1] : null,
    next: i < leaves.length - 1 ? leaves[i + 1] : null,
  }
}

// Slugify a heading's text the same way rehype-slug does (roughly) so the
// on-this-page anchors line up with the ids injected into the rendered HTML.
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}
