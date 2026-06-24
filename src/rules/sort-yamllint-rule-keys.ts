import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

const sortYamllintRuleKeysRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "yamllint.configs.configuration",
        "yamllint.configs.recommended",
        "yamllint.configs.all",
    ],
    description: "sort Yamllint rule keys for deterministic config reviews.",
    name: "sort-yamllint-rule-keys",
    propertyName: "rules",
    recommended: false,
});

export default sortYamllintRuleKeysRule;
