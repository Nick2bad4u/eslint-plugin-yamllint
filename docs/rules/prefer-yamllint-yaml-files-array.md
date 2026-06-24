# prefer-yamllint-yaml-files-array

prefer yaml-files to be an array.

## Rule details

This rule is part of `eslint-plugin-yamllint` and reports Yamllint bridge or config-authoring diagnostics through ESLint flat config.

## ESLint flat config example

```ts
import yamllint from "eslint-plugin-yamllint";

export default [...yamllint.configs.recommended];
```
