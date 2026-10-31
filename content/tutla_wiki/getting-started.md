---
title: "Getting started"
summary: "Clone the Tutla Wiki repository, run it locally and understand the folder layout."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

## Requirements

- Git
- Node.js 20 or newer and npm
- A GitHub account if you want to submit changes

You do not need to run anything locally for a small text fix. Every page has an **Edit** link that opens the file on GitHub, where you can edit it in the browser and open a pull request. Run the site locally when you add pages, images or sidebars so you can see the result first.

## Run the wiki locally

```bash
git clone https://github.com/TutlaMC/wiki.tutla.net
cd wiki.tutla.net
npm install
npm run dev
```

Open `http://localhost:3000`. Changes to Markdown files show up when you refresh.

Before opening a pull request, make sure the production build passes:

```bash
npm run build
```

A page with broken MDX or invalid frontmatter will fail here, which is much better than failing after merge.

## Repository layout

```text
wiki.tutla.net/
├── content/                 all documentation, one folder per project
│   ├── tums/
│   │   ├── index.md         the /tums page
│   │   ├── sidebar.json     sidebar, links and FAQ for the project
│   │   └── scripting/
│   │       └── events.md    the /tums/scripting/events page
│   └── tutla_wiki/          this handbook
├── public/content/          images and static files, mirrors content/
└── src/                     the website code
```

Two rules cover most of it:

1. **Words go in `content/`.** Create a folder per project.
2. **Images go in `public/content/`.** Use the same project folder name so files stay easy to find.

## URLs from file paths

| File | URL |
| --- | --- |
| `content/ccs/index.md` | `/ccs` |
| `content/tums/index.md` | `/tums` |
| `content/tums/scripting/events.md` | `/tums/scripting/events` |
| `content/tums/scripting/index.md` | `/tums/scripting` |

Folder and file names become URL segments, so use lowercase letters and hyphens. Avoid spaces.

## Your first page

Create `content/my-project/index.md`:

```markdown
---
title: "My Project"
summary: "One sentence describing my project."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: false
---

My Project does something useful.

## Features

- Fast
- Small
```

Run `npm run dev` and visit `/my-project`. You have just added a page. The [tutorial](/tutla_wiki/tutorial) takes it much further.
