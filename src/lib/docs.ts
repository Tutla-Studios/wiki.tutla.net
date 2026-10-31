import fs from "fs"
import path from "path"

export interface DocNode {
  name: string
  path: string
  isDir: boolean
  children?: DocNode[]
}

const CONTENT_ROOT = path.join(process.cwd(), "content")

export function readDocsDir(dirPath = CONTENT_ROOT): DocNode[] {
  try {
    if (!fs.existsSync(dirPath)) {
      console.warn(`Directory does not exist: ${dirPath}`)
      return []
    }
    
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    const result: DocNode[] = []
    
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue
      
      const fullPath = path.join(dirPath, entry.name)
      
      try {
        if (entry.isDirectory()) {
          const children = readDocsDir(fullPath)
          // Directories backed by github.txt are rendered from the remote tree.
          if (children.length === 0 && fs.existsSync(path.join(fullPath, "github.txt"))) continue
          result.push({ name: entry.name, path: fullPath, isDir: true, children })
        } else if (entry.name.endsWith(".md")) {
          const name = entry.name.replace(/\.md$/, "")
          result.push({ name, path: fullPath, isDir: false })
        }
      } catch (entryError) {
        console.error(`Error processing entry ${fullPath}:`, entryError)
      }
    }
    
    return result
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return []
  }
}

// Reserved sidebar.json keys that configure the docs chrome rather than
// contributing a page to the navigation tree.
const RESERVED_KEYS = new Set(["github", "modrinth", "website", "faq"])

export interface SidebarLinks {
  github?: string
  modrinth?: string
  website?: string
}

export interface SidebarConfig {
  links: SidebarLinks
  faq: Record<string, string> | null
  tree: DocNode[]
}

// Read and interpret a project's sidebar.json, splitting the reserved
// configuration keys (external links + FAQ) from the actual page tree.
export function loadSidebarConfig(project: string): SidebarConfig | null {
  const sidebarPath = path.join(CONTENT_ROOT, project, "sidebar.json")
  if (!fs.existsSync(sidebarPath)) return null

  try {
    return parseSidebarConfig(fs.readFileSync(sidebarPath, "utf8"), project)
  } catch (error) {
    console.error(`Error parsing sidebar.json for ${project}:`, error)
    return null
  }
}

// Interpret sidebar.json text. `resolve` optionally rewrites page values
// (used for sidebar.json files that live in a synced GitHub folder).
export function parseSidebarConfig(
  text: string,
  project: string,
  resolve: (value: string) => string = (v) => v
): SidebarConfig | null {
  let raw: Record<string, unknown>
  try {
    raw = JSON.parse(text)
  } catch (error) {
    console.error(`Error parsing sidebar.json for ${project}:`, error)
    return null
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null

  const links: SidebarLinks = {}
  if (typeof raw.github === "string") links.github = raw.github
  if (typeof raw.modrinth === "string") links.modrinth = raw.modrinth
  if (typeof raw.website === "string") links.website = raw.website

  let faq: Record<string, string> | null = null
  if (raw.faq && typeof raw.faq === "object" && !Array.isArray(raw.faq)) {
    const entries: Record<string, string> = {}
    for (const [q, a] of Object.entries(raw.faq as Record<string, unknown>)) {
      if (typeof a === "string") entries[q] = a
    }
    if (Object.keys(entries).length > 0) faq = entries
  }

  const contentEntries: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (!RESERVED_KEYS.has(key)) contentEntries[key] = value
  }

  const tree = generateDocsUsingContents(contentEntries, resolve)
  if (faq) {
    tree.push({ name: "FAQ", path: `/${project}/faq`, isDir: false })
  }

  return { links, faq, tree }
}

export function generateDocsUsingContents(
  sidebarContents: Record<string, unknown>,
  resolve: (value: string) => string = (v) => v
): DocNode[] {
  const result: DocNode[] = []
  
  try {
    for (const [key, value] of Object.entries(sidebarContents)) {
      if (typeof value === "object" && value !== null) {
        result.push({
          name: key,
          path: key,
          isDir: true,
          children: generateDocsUsingContents(value as Record<string, unknown>, resolve)
        })
      } else if (typeof value === "string") {
        result.push({
          name: key,
          path: resolve(value),
          isDir: false
        })
      }
    }
  } catch (error) {
    console.error("Error generating docs using contents:", error)
  }
  
  return result
}