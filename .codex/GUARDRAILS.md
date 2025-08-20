Hard stops:
- No dependency or CI changes without “Allow infra changes: yes”.
- No deletion of public exports without deprecation note + test updates.
- No content/schema changes without migration plan.
- No secrets/tokens in code or examples.

Quality gates:
- Lint + Prettier pass.
- Unit/integration tests updated; UI stories compile.
- Accessibility: interactive elements labeled; headings hierarchical.

Change etiquette:
- Keep diffs minimal and scoped to the task.
- If a broad refactor is beneficial, propose it in summary; do not execute unless the task permits it.
