// app/robots.ts
// Next.js serves this as /robots.txt automatically

import type { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://wiki.tutla.net"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "Google-Extended",
          "PerplexityBot",
          "anthropic-ai",
          "Applebot-Extended",
          "FacebookBot",
        ],
        allow: ["/", "/llms.txt"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
