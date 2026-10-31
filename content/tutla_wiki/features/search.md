---
title: "Search"
summary: "How the wiki's full-text search works and how to write pages that are easy to find."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

## Using search

Press `Ctrl+K` (or `⌘K` on a Mac) on any page to open the search box, then start typing. Results update as you type and show the page title, its summary and a snippet with your match highlighted.

Search covers every page on the wiki, including pages synced from GitHub.

## What is searched

Each page is indexed on three fields:

1. The **title**
2. The **summary**
3. The **body text**, with code blocks and link URLs stripped out

Matching is fuzzy, so small typos still find the right page. The top ten results are returned.

## Writing pages that are easy to find

- **Put the key term in the title.** "Custom events" beats "Part 3".
- **Write a real summary.** It is searched and shown in results.
- **Use the words readers use.** If people say "variables", do not write only "bindings".
- **Use descriptive headings.** Their text is part of the body.
- **Do not hide text in code blocks.** Code is excluded from the index, so important explanations belong in prose.

## For maintainers

The search index is built from the files in `content/` the first time the search endpoint is called after the server starts. Restarting or redeploying refreshes it. The endpoint is `/api/search?q=your+query`, and it is blocked for crawlers in `robots.txt` so only the in-page search box uses it.
