# Getting started

Install `eslint-plugin-yamllint`, add one flat-config preset, and run ESLint over the YAML files you want covered.

## Install

```sh
npm install --save-dev eslint-plugin-yamllint
```

The plugin delegates YAML linting to yamllint-js. Keep Yamllint rule behavior in Yamllint config, then use this plugin for ESLint integration and config-file guardrails.

## Add the recommended preset

```js
import yamllint from "eslint-plugin-yamllint";

export default [
 {
  files: ["**/*.{yaml,yml}"],
  ...yamllint.configs.recommended,
 },
];
```

Use the recommended preset first when the goal is to surface YAML diagnostics in the same ESLint stream as the rest of the repository.

## Add config-file checks

```js
import yamllint from "eslint-plugin-yamllint";

export default [
 {
  files: ["**/*.{yaml,yml}"],
  ...yamllint.configs.recommended,
 },
 {
  files: [".yamllint.{yaml,yml}"],
  ...yamllint.configs.configuration,
 },
];
```

The configuration preset checks repository conventions around Yamllint config files. Native YAML linting still belongs to yamllint-js.

## Choose a narrower preset

- Use [`yamllint.configs.yamllintOnly`](./presets/yamllint-only.md) when you only want upstream YAML diagnostics.
- Use [`yamllint.configs.configuration`](./presets/configuration.md) when another job already runs Yamllint and ESLint should only police config files.
- Use [`yamllint.configs.all`](./presets/all.md) when you want every rule enabled explicitly.

Next, read the [Yamllint bridge guide](./guides/yamllint-bridge.md) and the [config-authoring guide](./guides/config-authoring.md).
