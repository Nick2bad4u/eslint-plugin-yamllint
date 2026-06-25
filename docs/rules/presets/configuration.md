# Configuration

Enable only the yamllint config-authoring rules.

Use this preset when YAML linting is handled elsewhere, but ESLint should still keep `.yamllint` style configuration predictable and reviewable.

## Flat config example

```ts
import yamllint from "eslint-plugin-yamllint";

export default [yamllint.configs.configuration];
```

Legacy alias: `yamllint.configs.configs` remains supported.

## Best fit

- Shared config repositories that publish yamllint defaults.
- Monorepos with centralized YAML linting but local yamllint config files.
- Teams that want config hygiene without running the yamllint bridge through ESLint.

## What this preset includes

- yamllint config filename checks.
- Required `rules` object and valid rule level checks.
- Unknown-property, empty-rules, ignore-pattern, YAML file shape, and sorting policy.

## What this preset does not include

- The `yamllint/yamllint` bridge rule.
- YAML diagnostics from upstream yamllint.

## Related preset docs

- [Presets overview](./index.md)
- [Recommended preset](./recommended.md)
- [Yamllint-only preset](./yamllint-only.md)
- [All preset](./all.md)
