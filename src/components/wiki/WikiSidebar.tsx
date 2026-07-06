import Link from "next/link"

interface SidebarSection {
  heading: string
  links: { label: string; href: string; external?: boolean }[]
}

const SECTIONS: SidebarSection[] = [
  {
    heading: "Navigation",
    links: [
      { label: "Main page", href: "/" },
      { label: "Documentation", href: "/tutla-wiki" },
      { label: "Recent changes", href: "https://github.com/Tutla-Studios/wiki.tutla.net/commits/main", external: true },
    ],
  },
  {
    heading: "Contribute",
    links: [
      { label: "Edit on GitHub", href: "https://github.com/Tutla-Studios/wiki.tutla.net", external: true },
      { label: "tutla.net", href: "https://tutla.net", external: true },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "GitHub", href: "https://github.com/Tutla-Studios", external: true },
      { label: "Discord", href: "https://tutla.net/discord", external: true },
    ],
  },
]

export default function WikiSidebar() {
  return (
    <div className="text-[13px] text-[#c9d1d9]">
      <Link href="/" className="mb-4 block no-underline">
        <span className="font-serif text-xl text-[#f0f6fc]">Tutla Wiki</span>
        <span className="mt-0.5 block text-[11px] italic text-[#8b949e]">
          the tutla knowledge base
        </span>
      </Link>

      {SECTIONS.map((section) => (
        <div key={section.heading} className="mb-4">
          <div className="mb-1 border-b border-[#21262d] pb-0.5 text-[12px] font-normal text-[#8b949e]">
            {section.heading}
          </div>
          <ul className="space-y-1">
            {section.links.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#79c0ff] no-underline hover:underline"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="text-[#79c0ff] no-underline hover:underline">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
