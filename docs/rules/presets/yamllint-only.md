# Yamllint bridge only

Enable only the yamllint bridge rule for YAML files.

This is the smallest adoption surface. It runs upstream yamllint through ESLint and leaves yamllint config-authoring policy out of the preset.

## Flat config example

```ts
import yamllint from "eslint-plugin-yamllint";

export default [yamllint.configs.yamllintOnly];
```

Legacy alias: `yamllint.configs.yaml` remains supported.

## Best fit

- Repositories that only want YAML diagnostics in ESLint.
- Teams migrating from a standalone `yamllint` CI step.
- Projects that already manage yamllint config conventions elsewhere.

## What this preset includes

- `yamllint/yamllint`
- YAML parser wiring for the files matched by the preset.

## What this preset does not include

- yamllint config file naming checks.
- Shape, unknown-property, empty-rule, ignore, level, or sorting policy for yamllint config files.

## Related preset docs

- [Presets overview](./index.md)
- [Recommended preset](./recommended.md)
- [Configuration preset](./configuration.md)
- [All preset](./all.md)
