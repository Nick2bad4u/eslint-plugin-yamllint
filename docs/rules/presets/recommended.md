# Recommended

Enable the yamllint bridge plus the common yamllint config-authoring checks.

This is the default rollout path for most repositories. It surfaces YAML findings in ESLint while enforcing low-noise config structure rules.

## Flat config example

```ts
import yamllint from "eslint-plugin-yamllint";

export default [...yamllint.configs.recommended];
```

## Best fit

- Application and package repositories that want one ESLint command to cover YAML and yamllint config files.
- Teams adopting yamllint in editors and CI at the same time.
- Repositories that want config hygiene without enabling every stricter policy immediately.

## What this preset includes

- `yamllint/yamllint`
- High-signal yamllint config rules for required objects, expected YAML file arrays, file naming, unknown properties, empty rules, and ignore patterns.

## What this preset does not include

- More opinionated config cleanup from [`configuration`](./configuration.md), such as rule-level validation and rule-key sorting.
- The full policy surface from [`all`](./all.md).

## Related preset docs

- [Presets overview](./index.md)
- [Yamllint-only preset](./yamllint-only.md)
- [Configuration preset](./configuration.md)
- [All preset](./all.md)

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `yamllint.configs.recommended`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                              | Fix | This preset | Also enabled in                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :-------------------------------------- |
| [`yamllint`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/yamllint)                                                                             |  —  | 🟡 Enabled  | [🧪](./yamllint-only.md) [🟣](./all.md) |
| [`require-yamllint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-config-file-naming-convention) |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md) |
| [`require-yamllint-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-rules-object)                                   |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-unknown-config-properties)       |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-empty-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-rules-object)                     |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-ignore-patterns)               |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-conflicting-ignore-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-conflicting-ignore-keys)           |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md) |
| [`prefer-yamllint-yaml-files-array`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/prefer-yamllint-yaml-files-array)                             |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md) |
| [`require-yamllint-valid-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-valid-rule-levels)                         |  —  | —           | [🔧](./configuration.md) [🟣](./all.md) |
| [`sort-yamllint-rule-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/sort-yamllint-rule-keys)                                               |  —  | —           | [🔧](./configuration.md) [🟣](./all.md) |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
