import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

const requireYamllintValidRuleLevelsRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "yamllint.configs.configuration",
        "yamllint.configs.recommended",
        "yamllint.configs.all",
    ],
    description: "require Yamllint rule levels to be valid.",
    name: "require-yamllint-valid-rule-levels",
    propertyName: "rules",
    recommended: false,
});

export default requireYamllintValidRuleLevelsRule;
