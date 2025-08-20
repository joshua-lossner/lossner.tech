# Architecture (lossner.tech)

- Framework: Next.js (App Router), MDX content, TailwindCSS
- Content source: `/content` with frontmatter schema (see docs/CONTENT_SCHEMA.md)
- Deploy: Vercel (prod: main, preview: test)

## Invariants
- Static-first; no server DB. API routes only if strictly necessary (e.g., contact form).
- Page metadata derives from content frontmatter.
- Design system lives in `/components/ui` with tokens in `tailwind.config.ts`.

## Routing
- App Router under `/app`
- Shared layout and metadata per route segment

## Content
- All resume/writings use frontmatter defined in `docs/CONTENT_SCHEMA.md`.
