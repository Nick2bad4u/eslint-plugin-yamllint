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

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `yamllint.configs.yamllintOnly`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                              | Fix | This preset | Also enabled in                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :------------------------------------------------------------- |
| [`yamllint`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/yamllint)                                                                             |  —  | 🧪 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                          |
| [`require-yamllint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-config-file-naming-convention) |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`require-yamllint-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-rules-object)                                   |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-unknown-config-properties)       |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-empty-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-rules-object)                     |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-ignore-patterns)               |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-conflicting-ignore-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-conflicting-ignore-keys)           |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`prefer-yamllint-yaml-files-array`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/prefer-yamllint-yaml-files-array)                             |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`require-yamllint-valid-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-valid-rule-levels)                         |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)                        |
| [`sort-yamllint-rule-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/sort-yamllint-rule-keys)                                               |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)                        |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
