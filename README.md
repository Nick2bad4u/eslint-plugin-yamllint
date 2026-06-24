# eslint-plugin-yamllint

`eslint-plugin-yamllint` runs Yamllint from ESLint and adds Yamllint-specific config authoring rules.

## Installation

```sh
npm install --save-dev eslint-plugin-yamllint eslint yamllint-js yaml-eslint-parser
```

### Compatibility

- **Supported ESLint versions:** `9.x` and `10.x`
- **Config system:** Flat Config only
- **Node.js runtime:** `>=22.0.0`
- **License note:** this package bundles `yamllint-js`, which is GPL-3.0-or-later.

## Quick start

```ts
import yamllint from "eslint-plugin-yamllint";

export default [...yamllint.configs.recommended];
```

## Presets

| Preset                                                                    | Purpose                                                    |
| ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [`yamllint.configs.recommended`](./docs/rules/presets/recommended.md)     | Enable the Yamllint bridge plus config authoring guidance. |
| [`yamllint.configs.yamllintOnly`](./docs/rules/presets/yamllint-only.md)  | Enable only the Yamllint bridge workflow.                  |
| [`yamllint.configs.configuration`](./docs/rules/presets/configuration.md) | Enable only Yamllint config authoring rules.               |
| [`yamllint.configs.all`](./docs/rules/presets/all.md)                     | Enable every rule shipped by the plugin.                   |

Aliases remain available:

- `yamllint.configs.yaml` -> `yamllint.configs.yamllintOnly`
- `yamllint.configs.configs` -> `yamllint.configs.configuration`

## Rules

Fix legend:

- `🔧` = autofixable
- `—` = report only

Preset key legend:

- [`🟡`](./docs/rules/presets/recommended.md) — [`yamllint.configs.recommended`](./docs/rules/presets/recommended.md)
- [`🧪`](./docs/rules/presets/yamllint-only.md) — [`yamllint.configs.yamllintOnly`](./docs/rules/presets/yamllint-only.md)
- [`🔧`](./docs/rules/presets/configuration.md) — [`yamllint.configs.configuration`](./docs/rules/presets/configuration.md)
- [`🟣`](./docs/rules/presets/all.md) — [`yamllint.configs.all`](./docs/rules/presets/all.md)

| Rule | Fix | Preset key |
| --- | :-: | :-- |
| [`disallow-yamllint-conflicting-ignore-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-conflicting-ignore-keys) | — | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md) |
| [`disallow-yamllint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-ignore-patterns) | — | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md) |
| [`disallow-yamllint-empty-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-empty-rules-object) | — | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md) |
| [`disallow-yamllint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/disallow-yamllint-unknown-config-properties) | — | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md) |
| [`prefer-yamllint-yaml-files-array`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/prefer-yamllint-yaml-files-array) | — | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md) |
| [`require-yamllint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-config-file-naming-convention) | — | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md) |
| [`require-yamllint-rules-object`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-rules-object) | — | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md) |
| [`require-yamllint-valid-rule-levels`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/require-yamllint-valid-rule-levels) | — | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md) |
| [`sort-yamllint-rule-keys`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/sort-yamllint-rule-keys) | — | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md) |
| [`yamllint`](https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/yamllint) | — | [🟡](./docs/rules/presets/recommended.md) [🧪](./docs/rules/presets/yamllint-only.md) [🟣](./docs/rules/presets/all.md) |