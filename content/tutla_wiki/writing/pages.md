---
title: "Pages and layouts"
summary: "The difference between article pages and documentation pages, and how to choose."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

The wiki has two page layouts. A single frontmatter field, `isdoc`, picks between them.

## Article layout (`isdoc: false`)

A standalone, encyclopedia-style page. It shows the title, the summary, the first image from your content as a header image, the created and updated dates, and an outline of headings.

Use it for people, concepts, small projects and anything that fits in one page. See [Shade](/shade) or [Ehan](/ehan) for examples.

## Documentation layout (`isdoc: true`)

A multi-page layout with:

- A **sidebar** tree on the left for the whole project
- A **top navbar** with the project's GitHub, Modrinth and website icons
- A **breadcrumb** trail
- An **on this page** outline built from your headings
- **Previous / next** buttons that follow the sidebar order
- An **Edit** link to the file on GitHub

Use it for any project with more than a couple of pages. See [Tums](/tums).

## Which should I pick?

| Situation | Layout |
| --- | --- |
| One page about a person or idea | Article |
| A library, mod or app with guides and references | Documentation |
| A short overview that links out to a real documentation project | Article for the overview, documentation for the rest |

## Rules for documentation projects

- The project's root page lives at `content/<project>/index.md`.
- Set `isdoc: true` on the root page and on every page in the project.
- Add a [`sidebar.json`](/tutla_wiki/features/sidebar) for full control. Without one, the sidebar is generated from the folder structure in alphabetical order, and only works when the root `index.md` has `isdoc: true`.
- Pages pulled in through [GitHub sync](/tutla_wiki/features/github-sync) always use the documentation layout.

## Redirects

To make a page forward visitors somewhere else, add a `redirect` field:

```markdown
---
title: "Old name"
redirect: "/new-name"
---
```

This is how renamed pages keep working.
