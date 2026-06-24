import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

const preferYamllintYamlFilesArrayRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "yamllint.configs.configuration",
        "yamllint.configs.recommended",
        "yamllint.configs.all",
    ],
    description: "prefer yaml-files to be an array.",
    name: "prefer-yamllint-yaml-files-array",
    propertyName: "yaml-files",
    recommended: true,
});

export default preferYamllintYamlFilesArrayRule;
