# Content Schema

## Frontmatter: /content/resume/entries/*.md
- type: "job" | "education" | "project"
- title: string
- startDate: YYYY-MM
- endDate: YYYY-MM | "present"
- tags: string[]
- summary: string
- bullets: string[]
- slug: string (unique)

Validation:
- If endDate != "present", endDate >= startDate.

## Frontmatter: /content/posts/*.mdx
- title: string
- slug: string
- date: YYYY-MM-DD
- tags: string[]
- summary: string
- hero?: string (path under /public)
