# disallow-yamllint-empty-ignore-patterns

Disallow empty ignore patterns keeps yamllint configuration files predictable when they are reviewed beside ESLint configuration.

> **Rule catalog ID:** R002

## Targeted pattern scope

This rule targets YAML files and yamllint configuration. Use it in repositories where ESLint is the central feedback surface for local development, CI, and editor diagnostics.

### Matched patterns

- Files matched by the bridge rule or the configuration preset that enables `yamllint/disallow-yamllint-empty-ignore-patterns`.
- .yamllint and related yamllint configuration documents.

### Detection boundaries

The rule does not reimplement the full yamllint configuration language. It validates the bridge-facing behavior that ESLint can report reliably and leaves deeper domain checks to yamllint.

## What this rule reports

The rule reports empty arrays, empty objects, or blank pattern lists that look intentional but do not configure useful yamllint behavior.

## Why this rule exists

Bridge plugins are useful only when they preserve upstream behavior and keep configuration reviewable. This rule keeps yamllint feedback close to ESLint without forcing users to copy an entire upstream config into ESLint options.

## ❌ Incorrect

```yaml
rules:
 line-length: maybe
```

## ✅ Correct

```yaml
rules:
 line-length: warning
```

## Behavior and migration notes

Start with the recommended preset when adopting the plugin. Move project-specific yamllint options into the upstream config file and keep ESLint options limited to file selection, config path, and bridge behavior.

## Additional examples

```js
import yamllint from "eslint-plugin-yamllint";

export default [
 yamllint.configs.recommended,
 {
  rules: {
   "yamllint/disallow-yamllint-empty-ignore-patterns": "error",
  },
 },
];
```

## ESLint flat config example

```js
import yamllint from "eslint-plugin-yamllint";

export default [yamllint.configs.recommended];
```

## When not to use it

Do not enable this rule when yamllint is intentionally run outside ESLint and duplicate editor or CI diagnostics would slow the project down.

## Package documentation

eslint-plugin-yamllint package documentation:

- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-yamllint#readme)
- [Rule source](https://github.com/Nick2bad4u/eslint-plugin-yamllint/tree/main/src/rules)

## Further reading

- [yamllint documentation](https://yamllint.readthedocs.io/)
- [ESLint flat config documentation](https://eslint.org/docs/latest/use/configure/configuration-files)

## Adoption resources

- Enable the recommended preset first.
- Keep upstream configuration in `.yamllint` unless a rule option explicitly asks for a different file.
- Run `npm run lint:remark` before publishing docs changes so heading drift is caught locally.
