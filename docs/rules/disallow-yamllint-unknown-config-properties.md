# disallow-yamllint-unknown-config-properties

disallow unknown top-level Yamllint config properties.

## Rule details

This rule is part of `eslint-plugin-yamllint` and reports Yamllint bridge or config-authoring diagnostics through ESLint flat config.

## ESLint flat config example

```ts
import yamllint from "eslint-plugin-yamllint";

export default [...yamllint.configs.recommended];
```
