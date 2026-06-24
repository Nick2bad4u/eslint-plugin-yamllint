# Rule overview

`eslint-plugin-yamllint` brings yamllint-js findings into the ESLint run you already use for editors, CI, and pull-request checks. The bridge rule runs yamllint-js against YAML text, while the config-authoring rules keep common Yamllint policy decisions close to the rest of your flat config.

## What belongs here

Use this plugin when YAML style and correctness findings should fail in the same lint job as TypeScript, Markdown, package metadata, and other repository checks. The plugin does not recreate Yamllint's rule engine. It delegates YAML analysis to yamllint-js and translates the reported problems into ESLint reports.

## Recommended path

Start with `yamllint.configs.recommended` for normal YAML diagnostics. Add `yamllint.configs.configuration` when a repository has a Yamllint config file and you want ESLint to enforce naming, rules object shape, valid rule levels, known top-level properties, and sorted rule keys.

## Rule groups

| Group              | Use it for                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Bridge diagnostics | Run yamllint-js against YAML text and surface native findings through ESLint.                       |
| Config shape       | Catch missing rules objects, unknown top-level config keys, and unsupported filenames.              |
| Config consistency | Reject conflicting ignore keys, empty ignore patterns, empty rule objects, and invalid rule levels. |

## Upstream options

Pass upstream behavior through the bridge rule options instead of duplicating Yamllint configuration in ESLint. Use the Yamllint config file for Yamllint-specific policy, and use this plugin's config rules for repository conventions around that config file.
