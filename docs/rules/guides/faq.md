# FAQ

## Does this replace Yamllint?

No. The bridge delegates YAML diagnostics to yamllint-js and reports the results through ESLint.

## Should I run Yamllint separately in CI?

Usually no, if ESLint already runs the `yamllint/yamllint` rule over the same files. Running both can be useful during migration, but long term it creates duplicate findings.

## Where should Yamllint options live?

Keep Yamllint behavior in the Yamllint config file. Use ESLint config for file selection, severity, and repository policy rules.

## Why are there config-authoring rules?

They catch config drift that native YAML linting does not try to police: unsupported filenames, unknown top-level keys, conflicting ignore keys, invalid rule levels, empty rule objects, and unstable rule ordering.

## Which preset should I use?

Use [`recommended`](../presets/recommended.md) for normal adoption. Use [`yamllint-only`](../presets/yamllint-only.md) when you only want upstream findings, and [`configuration`](../presets/configuration.md) when another job already handles YAML linting.
