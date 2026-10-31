---
title: "Sidebar and FAQ"
summary: "Control a project's sidebar, navbar links and auto-generated FAQ page with sidebar.json."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

A documentation project can ship a `sidebar.json` file next to its `index.md`. It defines the navigation tree, the icon links in the top bar and a FAQ page, all in one place.

## The basics

```json
{
    "github": "https://github.com/TutlaMC/tums",
    "modrinth": "https://modrinth.com/mod/tums",
    "website": "https://tutla.net/tums",
    "faq": {
        "What is Tums?": "A Fabric mod that adds a scripting language to Minecraft."
    },
    "Introduction": "/tums/",
    "Scripting": {
        "Getting started": "/tums/scripting",
        "Basics": {
            "Variables": "/tums/scripting/basic/variable"
        }
    }
}
```

## Reserved keys

Four keys configure the page chrome instead of adding navigation items.

| Key | Effect |
| --- | --- |
| `github` | Shows a GitHub icon in the navbar. |
| `modrinth` | Shows a Modrinth icon in the navbar. |
| `website` | Shows a website icon in the navbar. |
| `faq` | Generates a FAQ page at `/<project>/faq`. |

Every other key is a sidebar entry.

## Building the tree

- A **string value** is a page. The key is the label and the value is the page URL.
- An **object value** is a collapsible group. Its keys are the children, and you can nest groups as deep as you like.
- **Order matters.** The sidebar shows entries in file order, and the previous / next buttons at the bottom of each page follow the same order.
- Labels are shown capitalised, and hyphens become spaces.

Page values are URLs, not file paths. Use `/tums/scripting/events`, not `content/tums/scripting/events.md`. A value that points at a folder's `index.md` uses the folder URL, such as `/tums/scripting`.

## The FAQ page

Each entry in `faq` is a question mapped to its answer. The wiki turns them into a page at `/<project>/faq` with one section per question, and adds a **FAQ** link at the end of the sidebar. The questions also appear in the **On this page** outline, so readers can jump to them.

Answers are plain text. For longer explanations, write a normal page and link to it from the answer.

## Without a sidebar.json

If a documentation project has no `sidebar.json`, the sidebar is built from the folder structure, sorted alphabetically. That is fine for small projects, but you lose control of order, labels and links. Add a `sidebar.json` as soon as a project has more than a few pages.

## Pages not in the sidebar

A page left out of `sidebar.json` still works. It has a URL, shows up in search, and is listed in the sitemap. It just has no sidebar entry, and no previous / next buttons. This suits drafts and rarely needed reference pages.

## Pages from GitHub

Folders synced from GitHub are added to the sidebar automatically after your own entries. See [GitHub sync](/tutla_wiki/features/github-sync).
