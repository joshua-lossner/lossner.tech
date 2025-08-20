# lossner.tech

This repository powers Joshua Lossner’s personal website (**lossner.tech**).

## What this repo is optimized for
- **Codex-first** workflows: tasks are provided as structured prompts; Codex produces small, testable diffs.
- **Static-first** site using Next.js (App Router), MDX content, and TailwindCSS.
- **Clear guardrails**: see `.codex/` and `docs/`.

## Quick start
- Read `docs/ARCHITECTURE.md` and `docs/CONTENT_SCHEMA.md`
- For Codex tasks, use `.github/ISSUE_TEMPLATE/codex-task.md`
- Repo map: `.codex/REPO_MAP.txt` (regenerate: `tree -I 'node_modules|.git|.next|build' > .codex/REPO_MAP.txt`)

## Branches
- `main` → production (Vercel)
- `test` → preview

## Conventions
- See `docs/STYLEGUIDE.md` (code) and `docs/COPY_TONE.md` (site text).
