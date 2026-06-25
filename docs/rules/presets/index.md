# Presets

`eslint-plugin-yamllint` exposes focused flat-config presets for YAML linting and yamllint config authoring.

- `🟡` [`yamllint.configs.recommended`](./recommended.md) — default rollout path for YAML diagnostics plus common config hygiene.
- `🧪` [`yamllint.configs.yamllintOnly`](./yamllint-only.md) — bridge-only YAML linting.
- `🔧` [`yamllint.configs.configuration`](./configuration.md) — config-authoring rules without YAML linting.
- `🟣` [`yamllint.configs.all`](./all.md) — every current bridge and config-authoring rule.

Legacy aliases remain available for compatibility:

- `yamllint.configs.yaml` → `yamllint.configs.yamllintOnly`
- `yamllint.configs.configs` → `yamllint.configs.configuration`

Use the preset pages in this section for copy/paste config snippets and rollout notes.

## Rule matrix

Fix legend:

- `🔧` = autofixable
- `—` = report only

Preset key legend:

- [`🟡`](./recommended.md) — [`yamllint.configs.recommended`](./recommended.md)
- [`🧪`](./yamllint-only.md) — [`yamllint.configs.yamllintOnly`](./yamllint-only.md)
- [`🔧`](./configuration.md) — [`yamllint.configs.configuration`](./configuration.md)
- [`🟣`](./all.md) — [`yamllint.configs.all`](./all.md)

| Rule                                                                                                                                                              | Fix | Preset key                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :------------------------------------------------------------- |
| [`yamllint`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/yamllint)                                                                             |  —  | [🟡](./recommended.md) [🧪](./yamllint-only.md) [🟣](./all.md) |
| [`require-yamllint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-config-file-naming-convention) |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`require-yamllint-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-rules-object)                                   |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-unknown-config-properties)       |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-empty-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-rules-object)                     |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-ignore-patterns)               |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-yamllint-conflicting-ignore-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-conflicting-ignore-keys)           |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`prefer-yamllint-yaml-files-array`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/prefer-yamllint-yaml-files-array)                             |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`require-yamllint-valid-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-valid-rule-levels)                         |  —  | [🔧](./configuration.md) [🟣](./all.md)                        |
| [`sort-yamllint-rule-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/sort-yamllint-rule-keys)                                               |  —  | [🔧](./configuration.md) [🟣](./all.md)                        |
