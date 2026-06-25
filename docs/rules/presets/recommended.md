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
