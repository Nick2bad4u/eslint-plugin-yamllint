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
