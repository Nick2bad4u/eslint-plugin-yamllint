# Config authoring

The configuration preset checks Yamllint config files as repository policy. It is not a replacement for yamllint-js diagnostics.

## What to enforce

- Use an expected Yamllint config filename so tools and humans find it quickly.
- Keep `rules` as an object.
- Reject empty rule objects.
- Reject unknown top-level properties.
- Reject conflicting ignore key styles.
- Require valid rule levels.
- Keep rule keys sorted when order is not meaningful.

## Example

```js
import yamllint from "eslint-plugin-yamllint";

export default [
 {
  files: [".yamllint.{yaml,yml}"],
  ...yamllint.configs.configuration,
 },
];
```

## Related pages

Use the [configuration preset](../presets/configuration.md) for the curated set. Use the [tool behavior map](./tool-to-rule-map.md) to decide whether a policy should be enforced by Yamllint or by one of this plugin's config-authoring rules.
