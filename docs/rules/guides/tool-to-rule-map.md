# Tool behavior to rule map

Use this page to decide whether a finding should come from Yamllint itself or from this plugin's ESLint rules.

| Concern                                    | Source of truth   | ESLint rule                                                                                              |
| ------------------------------------------ | ----------------- | -------------------------------------------------------------------------------------------------------- |
| YAML parsing and Yamllint rule diagnostics | yamllint-js       | [`yamllint/yamllint`](../yamllint.md)                                                                    |
| Yamllint config filename                   | Repository policy | [`require-yamllint-config-file-naming-convention`](../require-yamllint-config-file-naming-convention.md) |
| Top-level `rules` shape                    | Repository policy | [`require-yamllint-rules-object`](../require-yamllint-rules-object.md)                                   |
| Known top-level config keys                | Repository policy | [`disallow-yamllint-unknown-config-properties`](../disallow-yamllint-unknown-config-properties.md)       |
| Empty rule objects                         | Repository policy | [`disallow-yamllint-empty-rules-object`](../disallow-yamllint-empty-rules-object.md)                     |
| Empty ignore patterns                      | Repository policy | [`disallow-yamllint-empty-ignore-patterns`](../disallow-yamllint-empty-ignore-patterns.md)               |
| Conflicting ignore keys                    | Repository policy | [`disallow-yamllint-conflicting-ignore-keys`](../disallow-yamllint-conflicting-ignore-keys.md)           |
| `yaml-files` shape                         | Repository policy | [`prefer-yamllint-yaml-files-array`](../prefer-yamllint-yaml-files-array.md)                             |
| Valid rule levels                          | Repository policy | [`require-yamllint-valid-rule-levels`](../require-yamllint-valid-rule-levels.md)                         |
| Stable rule key ordering                   | Repository policy | [`sort-yamllint-rule-keys`](../sort-yamllint-rule-keys.md)                                               |

If the issue changes how YAML files are linted, let Yamllint own it. If the issue makes the Yamllint config easier to review and reuse across repositories, enforce it with this plugin.
