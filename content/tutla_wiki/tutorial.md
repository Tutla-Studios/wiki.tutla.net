---
title: "Tutorial: document a project"
summary: "A complete walkthrough that builds a documentation project from scratch: folders, pages, sidebar, FAQ, images, GitHub sync, testing and submitting."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

In this tutorial you will document an imaginary project called **Zap**, a small command-line tool. By the end you will have a multi-page documentation site with a sidebar, a FAQ, an image, and a section synced from GitHub. Each step builds on the last.

Before you begin, finish [Getting started](/tutla_wiki/getting-started) so the wiki runs locally with `npm run dev`.

## Step 1: Create the project folder

```bash
mkdir content/zap
mkdir public/content/zap
```

The first folder holds the words, the second holds images. Use the same name for both.

## Step 2: Write the landing page

Create `content/zap/index.md`:

```markdown
---
title: "Zap"
summary: "Zap is a command-line tool that renames files in bulk."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

Zap renames hundreds of files in one command.

## Why Zap?

- Works on any operating system
- Previews changes before applying them
- Undo the last run with one flag

## Quick example

```bash
zap rename "*.jpg" "holiday-{n}.jpg"
```
```

Notice `isdoc: true`. That switches on the sidebar layout. Open `http://localhost:3000/zap` to see it.

The curly braces above are safe because they sit inside a code block. If you wrote them in a normal sentence, the build would fail; see the [MDX gotchas](/tutla_wiki/writing/markdown).

## Step 3: Add more pages

Create `content/zap/install.md`:

```markdown
---
title: "Installation"
summary: "How to install Zap on Windows, macOS and Linux."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

## Linux and macOS

```bash
curl -fsSL https://example.com/install.sh | sh
```

## Windows

Download the installer from the releases page and run it.

!((warning Restart your terminal)[Zap is added to your PATH, so open a new terminal window after installing.])
```

Create a nested folder for the reference section, with `content/zap/commands/rename.md`:

```markdown
---
title: "rename"
summary: "Reference for the zap rename command."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

Renames every file that matches a pattern.

## Options

| Flag | Description |
| --- | --- |
| `--dry-run` | Show changes without applying them |
| `--undo` | Reverse the last run |

Term
: Definition lists work too.
```

Your folder now looks like this:

```text
content/zap/
├── index.md
├── install.md
└── commands/
    └── rename.md
```

## Step 4: Build the sidebar

The pages exist at `/zap/install` and `/zap/commands/rename`, but nothing links to them yet. Create `content/zap/sidebar.json`:

```json
{
    "github": "https://github.com/example/zap",
    "website": "https://example.com/zap",
    "Introduction": "/zap/",
    "Installation": "/zap/install",
    "Commands": {
        "rename": "/zap/commands/rename"
    }
}
```

Refresh. You now have a sidebar with a collapsible **Commands** group, a GitHub and website icon in the top bar, and previous / next buttons at the bottom of each page.

## Step 5: Add a FAQ

Add a `faq` object to `sidebar.json`, next to the other entries:

```json
{
    "github": "https://github.com/example/zap",
    "website": "https://example.com/zap",
    "faq": {
        "Does Zap delete my files?": "No. Zap only renames files, and --undo restores the old names.",
        "Which platforms are supported?": "Windows, macOS and Linux."
    },
    "Introduction": "/zap/",
    "Installation": "/zap/install",
    "Commands": {
        "rename": "/zap/commands/rename"
    }
}
```

A **FAQ** link appears at the bottom of the sidebar and the page `/zap/faq` is created for you. There is no file to write.

## Step 6: Add an image

Save a screenshot as `public/content/zap/preview.png`, then reference it from `content/zap/index.md`:

```markdown
![Zap previewing a rename](/content/zap/preview.png)
```

This image is also used as the preview when someone shares the page on social media, so put it near the top.

## Step 7: Sync a folder from GitHub

Suppose Zap's repository keeps developer documentation in a `docs/dev` folder. Instead of copying it, mount it.

1. Create the folder `content/zap/dev`.
2. Create `content/zap/dev/github.txt` containing:

```text
https://github.com/example/zap/tree/main/docs/dev
```

3. Restart `npm run dev` so the new mount is detected, then visit `/zap/dev`.

Every Markdown file in that folder, and its subfolders, is now a page under `/zap/dev`, and the tree appears at the bottom of Zap's sidebar as a **dev** group. You did not touch `sidebar.json`.

Full details are in [GitHub sync](/tutla_wiki/features/github-sync).

!((important Use a real repository)[The example URL above is fictional. Point the file at a repository that exists and is public, or the mount will stay empty.])

## Step 8: Check the extras

Without doing anything else, your project now has:

- A search entry for every page. Press `Ctrl+K` and try typing "rename".
- Entries in `/sitemap.xml` and `/llms.txt`. Visit both to see them.
- Title, description and social metadata. View the page source and look for `og:title`.

Read [SEO and indexing](/tutla_wiki/features/seo) for how to improve them further.

## Step 9: Test and submit

Run the build:

```bash
npm run build
```

If it passes, commit and push:

```bash
git checkout -b docs/zap
git add content public
git commit -m "Add Zap documentation"
git push origin docs/zap
```

Then open a pull request. The [contributing guide](/tutla_wiki/contributing) covers what happens next.

## Recap

| You learned to | Using |
| --- | --- |
| Create a page | A Markdown file in `content/` |
| Pick a layout | `isdoc` in frontmatter |
| Organise navigation | `sidebar.json` |
| Add a FAQ | The `faq` key |
| Show images | Files in `public/content/` |
| Mirror a repository folder | `github.txt` |
| Verify your work | `npm run build` |

## Next steps

- Read the full [Markdown reference](/tutla_wiki/writing/markdown).
- Check your pages against the [style guide](/tutla_wiki/writing/style-guide).
- Look at [Tums](/tums) for a larger real-world example.
