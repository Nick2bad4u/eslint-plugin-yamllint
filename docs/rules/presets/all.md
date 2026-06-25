# All

Enable the yamllint bridge and every yamllint config-authoring rule shipped by this plugin.

Use this preset when you want the broadest policy surface and are comfortable with new config rules becoming active as the plugin grows.

## Flat config example

```ts
import yamllint from "eslint-plugin-yamllint";

export default [...yamllint.configs.all];
```

## Best fit

- Repository templates that should enforce the full yamllint policy from day one.
- Shared YAML config packages with a low tolerance for config drift.
- Mature repositories after the recommended preset has already been rolled out.

## What this preset includes

- `yamllint/yamllint`
- Every configuration-authoring rule currently exported by the plugin.

## What this preset does not include

- Nothing from this plugin is excluded.

## Related preset docs

- [Presets overview](./index.md)
- [Recommended preset](./recommended.md)
- [Yamllint-only preset](./yamllint-only.md)
- [Configuration preset](./configuration.md)

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `yamllint.configs.all`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                              | Fix | This preset | Also enabled in                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :---------------------------------------------- |
| [`yamllint`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/yamllint)                                                                             |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🧪](./yamllint-only.md) |
| [`require-yamllint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-config-file-naming-convention) |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md) |
| [`require-yamllint-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-rules-object)                                   |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md) |
| [`disallow-yamllint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-unknown-config-properties)       |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md) |
| [`disallow-yamllint-empty-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-rules-object)                     |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md) |
| [`disallow-yamllint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-ignore-patterns)               |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md) |
| [`disallow-yamllint-conflicting-ignore-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-conflicting-ignore-keys)           |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md) |
| [`prefer-yamllint-yaml-files-array`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/prefer-yamllint-yaml-files-array)                             |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md) |
| [`require-yamllint-valid-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-valid-rule-levels)                         |  —  | 🟣 Enabled  | [🔧](./configuration.md)                        |
| [`sort-yamllint-rule-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/sort-yamllint-rule-keys)                                               |  —  | 🟣 Enabled  | [🔧](./configuration.md)                        |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
