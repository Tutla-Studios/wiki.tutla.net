---
title: "Contributing"
summary: "How to submit documentation to the Tutla Wiki: fork, branch, write, build, pull request, and what reviewers look for."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

Anyone can contribute. Fixes of any size are welcome, from a single typo to an entire documentation project.

## Quick fix from the website

1. Open the page and click **Edit** at the top.
2. GitHub opens the file. Click the pencil icon, make your change and choose **Propose changes**.
3. GitHub creates a fork and a pull request for you.

For pages synced from GitHub, the Edit link goes to the project's own repository, so send your fix there.

## Full workflow

1. **Fork** `TutlaMC/wiki.tutla.net` on GitHub.
2. **Clone** your fork and create a branch:

   ```bash
   git checkout -b docs/my-project
   ```

3. **Write** your pages under `content/`. See the [tutorial](/tutla_wiki/tutorial) if this is your first time.
4. **Preview** with `npm run dev`.
5. **Build** with `npm run build` and fix any errors.
6. **Commit** with a clear message:

   ```bash
   git add content public
   git commit -m "Add My Project documentation"
   git push origin docs/my-project
   ```

7. **Open a pull request** against `main` and describe what you added.

## What reviewers check

- Content is accurate and examples work
- The [style guide](/tutla_wiki/writing/style-guide) checklist is satisfied
- Frontmatter is complete
- New pages are reachable from `sidebar.json`
- No copied text or images you do not have the right to use
- `npm run build` succeeds

## Adding a project that has its own repository

If a project already keeps documentation in its own repository, do not copy it. Create `content/<project>/index.md` as a landing page, add a `sidebar.json` if you want custom navigation, and mount the repository's docs folder with [GitHub sync](/tutla_wiki/features/github-sync). Future changes then arrive without touching this repository.

## Getting help

Open an issue on the repository, or ask in the Tutla [Discord](https://discord.tutla.net).
