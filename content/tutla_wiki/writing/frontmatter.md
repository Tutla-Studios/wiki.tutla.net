---
title: "Frontmatter"
summary: "Every frontmatter field the wiki understands, what it does and how it affects SEO."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

Frontmatter is the block of YAML at the very top of a page, between two `---` lines. It must be the first thing in the file.

```yaml
---
title: "Tums"
summary: "A Minecraft Mod that makes Minecraft Modding simpler."
created: "2025-09-30"
updated: "2026-11-01"
isdoc: true
tags: ["minecraft", "fabric", "scripting"]
author: "TutlaMC"
---
```

## Fields

| Field | Required | Purpose |
| --- | --- | --- |
| `title` | Yes | Page heading, browser tab title and search result title. |
| `summary` | Strongly recommended | Meta description, search result text and the line shown in `llms.txt`. |
| `created` | Recommended | Date the page was first written, as `YYYY-MM-DD`. |
| `updated` | Recommended | Date of the last meaningful edit. Used as `lastModified` in the sitemap. |
| `isdoc` | Yes | `true` for the documentation layout, `false` for an article. |
| `tags` | Optional | Becomes the page's meta keywords. |
| `author` | Optional | Shown in the metadata and in structured data. |
| `redirect` | Optional | Sends visitors to another URL instead of showing the page. |

## Tips

- **Quote your values.** A summary containing a colon will break YAML unless it is quoted.
- **Write the summary for a stranger.** It is what search engines and AI crawlers show. Aim for one clear sentence under 160 characters.
- **Update `updated` when you change content**, not for typo fixes. Crawlers use it to decide when to revisit the page.
- **Keep titles unique.** Duplicate titles confuse search results.

## Common mistakes

| Mistake | Result |
| --- | --- |
| Missing the closing `---` | The whole page renders as text. |
| Unquoted colon in `summary` | The build fails with a YAML error. |
| Dates like `1/11/26` | Sorting and sitemap dates become unreliable. Use `YYYY-MM-DD`. |
| `isdoc` left out | The page renders as an article, without a sidebar. |
