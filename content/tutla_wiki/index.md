---
title: "Tutla Wiki Documentation"
summary: "How the Tutla Wiki works and how to contribute documentation to it: page types, frontmatter, Markdown, sidebars, GitHub sync, search and SEO."
created: "2025-08-10"
updated: "2026-11-01"
isdoc: true
---

This is the contributor handbook for the Tutla Wiki. It explains how the site is built, every feature you can use when writing, and how to get your documentation merged.

If you only want to read about the wiki as a project, see the [Tutla Wiki article](/tutla-wiki).

## What you can do here

| I want to... | Go to |
| --- | --- |
| Set up the repo and add my first page | [Getting started](/tutla_wiki/getting-started) |
| Build a complete documentation project from nothing | [Tutorial](/tutla_wiki/tutorial) |
| Understand the two page types | [Pages and layouts](/tutla_wiki/writing/pages) |
| Know every frontmatter field | [Frontmatter](/tutla_wiki/writing/frontmatter) |
| See all supported Markdown | [Markdown reference](/tutla_wiki/writing/markdown) |
| Control the sidebar, links and FAQ | [Sidebar and FAQ](/tutla_wiki/features/sidebar) |
| Pull docs from a GitHub repository | [GitHub sync](/tutla_wiki/features/github-sync) |
| Understand search | [Search](/tutla_wiki/features/search) |
| Understand sitemap, robots and metadata | [SEO and indexing](/tutla_wiki/features/seo) |
| Submit my work | [Contributing](/tutla_wiki/contributing) |

## How it works in one minute

- Every page is a Markdown file inside the `content` folder of the wiki repository.
- The folder path is the URL. `content/tums/scripting/events.md` becomes `/tums/scripting/events`, and `index.md` becomes the folder's own URL.
- The site is built with Next.js. Every page is rendered to static HTML at build time.
- A project's sidebar comes either from a `sidebar.json` file or from its folder structure.
- A folder containing a `github.txt` file is filled with the contents of a GitHub folder.

!((important Wiki URLs are lowercase)[Routes are matched case-insensitively and links should always be written in lowercase, for example /tutla_wiki/getting-started.])
