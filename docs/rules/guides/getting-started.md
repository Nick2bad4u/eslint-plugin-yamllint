# Adoption checklist

Use this checklist when adding the plugin to an existing repository.

## Start small

- Enable [`yamllint.configs.recommended`](../presets/recommended.md) only for YAML files that should be linted.
- Exclude generated YAML, vendored manifests, and fixtures that intentionally violate style.
- Keep the native Yamllint config file as the source of truth for YAML lint behavior.

## Add policy after the bridge is green

- Add [`yamllint.configs.configuration`](../presets/configuration.md) for `.yamllint` files.
- Fix unknown keys, invalid levels, conflicting ignore keys, and empty rule objects before sharing the preset broadly.
- Review the [tool behavior map](./tool-to-rule-map.md) if a finding looks like it could belong to either Yamllint or ESLint.

## CI rollout

Run ESLint in the same job that already checks TypeScript, Markdown, package metadata, and workflow YAML. The value of the bridge is one diagnostics stream, not another standalone command that developers forget to run.
