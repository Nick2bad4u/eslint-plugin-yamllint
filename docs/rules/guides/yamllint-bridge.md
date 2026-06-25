# Yamllint bridge

The `yamllint/yamllint` rule runs yamllint-js and converts upstream findings into ESLint reports. ESLint owns file selection, ignore behavior, formatter output, and editor integration. yamllint-js owns YAML parsing and Yamllint rule semantics.

## What the bridge reports

The bridge is for YAML files, typically `*.yaml` and `*.yml`. It reports yamllint-js findings such as invalid YAML, indentation issues, line-length findings, duplicate keys, and rule-level style violations.

## What stays upstream

Keep Yamllint-specific behavior in Yamllint configuration.

Use ESLint options for:

- Choosing which files ESLint visits.
- Deciding which preset or rule severity to apply.
- Integrating findings into an existing lint job.

Use Yamllint config for:

- Rule options.
- Ignore patterns that affect Yamllint.
- YAML style policy that belongs to Yamllint rules.

## Related rules

- [`yamllint/yamllint`](../yamllint.md) runs the bridge.
- [`require-yamllint-valid-rule-levels`](../require-yamllint-valid-rule-levels.md) catches invalid config levels.
- [`sort-yamllint-rule-keys`](../sort-yamllint-rule-keys.md) keeps config review stable.
