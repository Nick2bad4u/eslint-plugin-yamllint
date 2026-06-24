---
name: "Codex-Instructions-ESLint-Remark-Docs"
description: "Instructions for writing eslint-plugin-remark documentation."
applyTo: "docs/**"
---

# Documentation Instructions

- Rule docs live in `docs/rules/<rule-id>.md` and must be manually authored.
- Keep examples Remark-specific and verify they match the implemented AST selector or bridge behavior.
- Use Flat Config examples only.
- Keep preset pages, README tables, and sidebar entries aligned with rule metadata and sync scripts.
- Do not leave Stylelint examples in rule, guide, or Docusaurus content.
- When documenting `remark/remark`, distinguish ESLint-side bridge behavior from native Remark CLI behavior.
