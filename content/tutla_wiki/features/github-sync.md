---
title: "GitHub sync"
summary: "Mirror a folder of a GitHub repository into the wiki by adding a github.txt file. Covers setup, how files become pages, linking, limits and troubleshooting."
created: "2026-11-01"
updated: "2026-11-09"
isdoc: true
---

GitHub sync lets a project's documentation live next to its source code. Instead of copying files into this repository, you point the wiki at a GitHub folder and it builds pages from everything inside.

## Quick setup

1. Create a folder inside `content/`, for example `content/tums/source/`.
2. Add a file called `github.txt` to it.
3. Put a GitHub folder URL on the first line:

```text
https://github.com/Tutla-Studios/tums/tree/main/src
```

That is all. The whole `src` folder and every subfolder beneath it now appear under `/tums/source`.

## Accepted URLs

| URL | Meaning |
| --- | --- |
| `https://github.com/owner/repo` | Whole repository, default branch |
| `https://github.com/owner/repo/tree/main` | Whole repository, `main` branch |
| `https://github.com/owner/repo/tree/main/docs` | Only the `docs` folder |
| `https://github.com/owner/repo/tree/v2/docs/api` | A nested folder on the `v2` branch or tag |

Blank lines and lines starting with `#` in `github.txt` are ignored, so you can leave a note for other maintainers.

!((warning Branch names with slashes are not supported)[Use a branch or tag name without slashes. A branch called feature/docs cannot be parsed from the URL.])

## How files become pages

The folder structure is copied exactly, relative to the URL you gave.

| File in the repository folder | Page URL (mounted at `/tums/source`) |
| --- | --- |
| `README.md` | `/tums/source` |
| `index.md` | `/tums/source` (wins over `README.md`) |
| `guide/intro.md` | `/tums/source/guide/intro` |
| `guide/README.md` | `/tums/source/guide` |
| `core/Parser.java` | `/tums/source/core/Parser.java` |

- **Markdown** files (`.md`, `.mdx`) render as normal pages. The title comes from frontmatter, otherwise from the first `#` heading, otherwise from the file name.
- **Source and config files** render as a single syntax-highlighted code block with the file name as the title. Supported types include Java, Kotlin, JavaScript, TypeScript, Python, Rust, Go, C and C++, C#, Ruby, PHP, shell, JSON, YAML, TOML, XML, HTML, CSS, SQL, Lua and plain text.
- **Everything else** is skipped: images, archives, binaries, files over 300 KB, and any file or folder whose name starts with a dot.

## Links and images inside synced Markdown

Relative references are rewritten automatically so they keep working:

- `![diagram](./img/flow.png)` is loaded from the repository's raw file URL.
- `[next](./events.md)` becomes a link to the matching wiki page, if that file is part of the sync.
- A link to a file that is not synced, such as a `.jar`, goes to its page on GitHub.

Absolute links and `#anchors` are left untouched.

Synced Markdown is compiled as plain Markdown, not MDX, so curly braces and angle brackets in a README will not break the build.

## What else is updated automatically

Synced pages take part in the whole site, not only the sidebar:

- **Sidebar**: the tree is appended to the project's sidebar. A mount directly inside a project folder appears as a group named after the folder. A mount placed at the project's top level, such as `content/tums/github.txt`, adds its entries straight into the sidebar.
- **Search**: Markdown pages are indexed.
- **Sitemap** and **`llms.txt`**: every page is listed.
- **Metadata**: each page gets a title, description, canonical URL, social tags and structured data.
- **Edit link**: points at the file on GitHub, so fixes go to the source repository.

## Sidebar from the repository

A `sidebar.json` at the root of the synced folder is not turned into a page. It is used as the project's sidebar instead, with the same format as a local [sidebar.json](/tutla_wiki/features/sidebar), including `links` and `faq`. Page values can be absolute wiki URLs (`/tums/scripting/events`) or paths relative to the synced folder (`scripting/events.md`).

If the project also has a local `content/<project>/sidebar.json`, the local one wins and the synced sidebar only fills in missing links and FAQ entries.

This lets a project keep its whole documentation in its own repository. Tums does this: `content/tums/` only contains `github.txt`, pointing at the `docs` folder of the Tums repository, which holds the pages and `sidebar.json`.

## Combining with local pages

A mounted folder can also contain ordinary files. If a local `.md` file and a synced page have the same URL, the local one wins. This is useful for writing a hand-made landing page above a generated reference:

```text
content/tums/
├── index.md          hand-written overview
├── sidebar.json      hand-written guide navigation
└── source/
    └── github.txt    API reference synced from the repository
```

## Freshness

The GitHub file list and contents are cached for one hour. Pages are generated when the site is built, so a change in the repository appears after the wiki's next deployment. Sitemap and `llms.txt` refresh on their own hourly schedule. If you need an update sooner, ask a maintainer to redeploy.

## Rate limits and private repositories

GitHub allows 60 unauthenticated API requests per hour per address. Maintainers can set a `GITHUB_TOKEN` environment variable on the build to raise that limit and to read private repositories. If a build has many mounts and no token, some of them may come back empty.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Nothing appears | The URL is invalid, the repository is private, or the rate limit was hit. Check the build log for a line starting with "Error fetching GitHub mount". |
| Some files are missing | They are binary, over 300 KB, or inside a dot-folder. Very large repositories may be truncated by GitHub; point the mount at a subfolder instead. |
| A link goes to GitHub instead of the wiki | The target file is not inside the synced folder. |
| Sidebar group is missing | The project already has a sidebar entry under the same URL prefix, so the automatic one was skipped. |
| 404 on a folder URL | The folder has no `README.md` or `index.md`, so there is no page for it. Folders without one only group their children in the sidebar. |

## Writing good synced docs

Because the same Markdown is read on GitHub and on the wiki, keep it portable:

- Use relative links between files.
- Start each folder with a `README.md` that explains what it contains.
- Add `title` and `summary` frontmatter to important pages. GitHub shows it as a small table, but the wiki uses it for SEO.
- Do not rely on the wiki's notice syntax, because it will look like plain text on GitHub.
