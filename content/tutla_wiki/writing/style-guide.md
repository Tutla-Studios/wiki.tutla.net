---
title: "Style guide"
summary: "Writing conventions for Tutla Wiki documentation: structure, tone, naming and review checklist."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

Consistent docs are easier to read and easier to maintain. These are the conventions the wiki follows.

## Tone

- Write plainly. Say what something does, then show it.
- Address the reader as "you".
- Prefer short sentences and active voice.
- Avoid marketing language. Do not call a feature "powerful" or "seamless"; show an example instead.
- Do not assume the reader has read other pages. Link to prerequisites instead of repeating them.

## Page structure

1. **One-line opening** that says what the page covers.
2. **Short explanation** of the concept.
3. **Example** the reader can copy.
4. **Reference details** such as options, tables and edge cases.
5. **Related pages** at the bottom, when useful.

Keep each page about one topic. If a page keeps growing, split it.

## Examples

- Every example should work as written. Test it.
- Show the output when it is not obvious.
- Use realistic names, not `foo` and `bar`, where you can.
- Give each code block a language.

## Naming files and folders

| Do | Don't |
| --- | --- |
| `getting-started.md` | `Getting Started.md` |
| `custom-events.md` | `customEvents.md` |
| `scripting/` | `Scripting Docs/` |

Lowercase, hyphen-separated or underscore-seperated and short. The file name becomes the URL, so changing it later breaks inbound links. If you must rename, leave a [redirect](/tutla_wiki/writing/pages) behind.

## Headings

- Use sentence case: "Creating a function", not "Creating A Function".
- Start at `##`.
- Do not skip levels. Go from `##` to `###`, not `##` to `####`.
- Make headings descriptive. They appear in search and in the outline.

## Review checklist

- [ ] Frontmatter is complete and `summary` reads well on its own
- [ ] `updated` reflects the change
- [ ] Every code block has a language and has been tested
- [ ] Images have alt text and live under `public/content/`
- [ ] New pages are listed in `sidebar.json`
- [ ] Links use absolute lowercase paths
- [ ] `npm run build` passes
