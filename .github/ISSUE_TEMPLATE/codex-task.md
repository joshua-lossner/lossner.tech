name: Codex Task
about: Structured task for Codex
title: "[codex] <concise goal>"
labels: ["codex"]
body:
  - type: textarea
    id: goal
    attributes: { label: Goal, description: Outcome and user impact }
  - type: textarea
    id: context
    attributes: { label: Context, description: Links to docs/ and prior issues }
  - type: textarea
    id: constraints
    attributes: { label: Constraints, description: Tech limits, banned changes }
  - type: textarea
    id: files
    attributes: { label: Files to touch, description: Exact paths Codex may edit }
  - type: textarea
    id: acceptance
    attributes: { label: Done criteria, description: Tests, metrics, UX states }
  - type: dropdown
    id: infra
    attributes:
      label: Allow infra changes
      options: [no, yes]
    validations: { required: true }
  - type: textarea
    id: output
    attributes: { label: Output format, value: "Use .codex/OUTPUT_FORMAT.md (Diff preferred)" }
