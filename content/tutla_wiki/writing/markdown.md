---
title: "Markdown reference"
summary: "Every Markdown feature available on the wiki, including tables, code highlighting, notices, definition lists and images."
created: "2026-11-01"
updated: "2026-11-01"
isdoc: true
---

Pages use GitHub-flavoured Markdown with a few extras. Each section below shows what to type.

## Headings

```markdown
## Section
### Subsection
#### Detail
```

Use a single `#` heading only if you need one. The page title already comes from frontmatter, so start your content at `##`. Headings get anchor ids automatically, and `##` to `####` appear in the **On this page** outline.

## Text, lists and links

```markdown
**bold**, *italic*, ~~strikethrough~~, `inline code`

- Bullet
- Another bullet
  - Nested bullet

1. First
2. Second

[Link to another page](/tums/scripting)
[External link](https://tutla.net)
```

Link to other wiki pages with an absolute path starting at `/`, without `.md`. A link to a folder uses the folder URL.

## Tables

```markdown
| Name | Type | Description |
| --- | --- | --- |
| `speed` | number | Movement speed |
| `name` | string | Display name |
```

## Code blocks

Put a language after the opening fence to get syntax highlighting:

````markdown
```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```
````

Highlighting is done at build time with the `github-dark` theme. Common languages such as `java`, `python`, `typescript`, `json`, `yaml`, `bash` and `lua` work. If a language is unknown the block still renders, just without colours.

To show a code block that itself contains a fence, wrap it in four backticks, as the example above does.

## Images

```markdown
![A short description](/content/my-project/screenshot.png)
```

The file lives at `public/content/my-project/screenshot.png`. Always write meaningful alt text. The **first image on a page** is also used as the social preview image when the page is shared, so put your best one first.

## Notices

A paragraph written in this exact form becomes a coloured notice box:

```markdown
!((Title)[The message body.])
!((warning Title)[The message body.])
!((important Title)[The message body.])
```

- No prefix gives a neutral grey box.
- `warning` gives a yellow box.
- `important` gives a red box.

The notice must be alone on its own line, with a blank line before and after. Inline formatting inside the message is not supported.

!((warning Notices are single line)[Keep the title and message on one line. Do not put line breaks inside the double parentheses.])

## Definition lists

```markdown
Term
: The definition of the term.

Another term
: Its definition.
```

## Horizontal rules

A line containing only `---` draws a divider. Leave blank lines around it.

## MDX gotchas

Local pages are compiled as MDX, a Markdown dialect that also understands JSX. Two characters cause trouble in normal prose:

| Character | Problem | Fix |
| --- | --- | --- |
| Curly braces | Treated as a JavaScript expression | Put in backticks, or write a backslash before the brace |
| Less-than sign | Treated as the start of an HTML tag | Put in backticks, or write `&lt;` |

Anything inside a code block or inline backticks is safe. If a build fails with an MDX or acorn error, look for one of these two characters in plain text.

Pages pulled from GitHub are different. They are compiled as plain Markdown, so braces and angle brackets are safe there.
