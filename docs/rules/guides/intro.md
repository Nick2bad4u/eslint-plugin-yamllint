# Guide overview

`eslint-plugin-yamllint` is a bridge plugin. It lets ESLint run yamllint-js and report YAML findings through the normal ESLint formatter, while separate rules cover the shape and maintainability of Yamllint config files.

## Use the guides in this order

1. Start with [Getting started](../getting-started.md) to add the recommended preset.
2. Read [Yamllint bridge](./yamllint-bridge.md) when you need to understand what the bridge rule delegates to upstream yamllint-js.
3. Read [Config authoring](./config-authoring.md) before enabling the configuration preset on `.yamllint` files.
4. Use [Tool behavior to rule map](./tool-to-rule-map.md) when deciding whether a finding should come from Yamllint or from this plugin's ESLint rules.

## Boundary

This plugin should not become a second Yamllint implementation. If a setting changes how YAML files are linted, keep it in Yamllint config. If a rule enforces repository consistency around that config file, it belongs in the configuration preset.
