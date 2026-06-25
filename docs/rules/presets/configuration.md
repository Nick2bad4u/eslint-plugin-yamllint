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

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `yamllint.configs.configuration`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                              | Fix | This preset | Also enabled in                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :------------------------------------------------------------- |
| [`yamllint`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/yamllint)                                                                             |  —  | —           | [🟡](./recommended.md) [🧪](./yamllint-only.md) [🟣](./all.md) |
| [`require-yamllint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-config-file-naming-convention) |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                          |
| [`require-yamllint-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-rules-object)                                   |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                          |
| [`disallow-yamllint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-unknown-config-properties)       |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                          |
| [`disallow-yamllint-empty-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-rules-object)                     |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                          |
| [`disallow-yamllint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-ignore-patterns)               |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                          |
| [`disallow-yamllint-conflicting-ignore-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-conflicting-ignore-keys)           |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                          |
| [`prefer-yamllint-yaml-files-array`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/prefer-yamllint-yaml-files-array)                             |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                          |
| [`require-yamllint-valid-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-valid-rule-levels)                         |  —  | 🔧 Enabled  | [🟣](./all.md)                                                 |
| [`sort-yamllint-rule-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/sort-yamllint-rule-keys)                                               |  —  | 🔧 Enabled  | [🟣](./all.md)                                                 |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
