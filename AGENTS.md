---
name: "Copilot-Instructions-ESLint-Remark-Plugin"
description: "Instructions for maintaining eslint-plugin-remark."
applyTo: "**"
---

# eslint-plugin-remark Instructions

## Project Role

This repository is `eslint-plugin-remark`: an ESLint Flat Config plugin that runs Remark through ESLint and provides Remark config-authoring rules for `remark.config.*` and `.remarkrc.*` files.

## Engineering Priorities

- Preserve the modern TypeScript, ESLint, Vitest, Docusaurus, package-validation, and sync-script infrastructure.
- Keep rule metadata, docs, tests, README tables, and preset matrices synchronized.
- Prefer surgical edits over replacing mature config or docs infrastructure.
- Do not reintroduce copied Stylelint rule content as filler.
- Do not invent new rules unless the user explicitly requests them or they are clearly part of the Remark migration task.

## Rule Implementation Standards

- Put rules in `src/rules/` and shared helpers in `src/_internal/`.
- Use `@typescript-eslint/utils` and repository helper types for strict rule definitions.
- No `any`; use `unknown`, type guards, precise generics, and existing utility types.
- Use specific AST selectors where possible.
- Every rule needs static metadata, actionable messages, schema, docs URL, tests, and a matching docs page.
- Autofix when the transformation is deterministic and safe; otherwise report only or provide suggestions.

## Remark Bridge Constraints

- The `remark/remark` rule runs on the root node from the plugin's internal full-document Markdown parser so the public presets stay compatible with both ESLint 9 and ESLint 10.
- Keep Remark execution isolated in the worker-backed bridge so ESLint rule execution remains synchronous.
- Treat Remark config loading as a runtime boundary: validate unknown config values and fail gracefully with ESLint diagnostics.
- Resolve string plugin specifiers relative to the Remark config file.

## Verification

Before claiming the repo is ready, run the relevant gate for the change. For broad migration work, prefer the aggregate release gate:

```bash
npm run release:verify
```

If a command produces large output, redirect it under `temp/` and inspect the relevant lines from there.
