# require-yamllint-config-file-naming-convention

require Yamllint config files to use a supported Yamllint config filename.

## Rule details

This rule is part of `eslint-plugin-yamllint` and reports Yamllint bridge or config-authoring diagnostics through ESLint flat config.

## ESLint flat config example

```ts
import yamllint from "eslint-plugin-yamllint";

export default [...yamllint.configs.recommended];
```
