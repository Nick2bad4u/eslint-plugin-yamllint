import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

/**
 * RequireYamllintRulesObjectRule ESLint rule contract.
 */
const requireYamllintRulesObjectRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "yamllint.configs.configuration",
        "yamllint.configs.recommended",
        "yamllint.configs.all",
    ],
    description:
        "require Yamllint configs to define rules as a mapping when present.",
    name: "require-yamllint-rules-object",
    propertyName: "rules",
    recommended: true,
});

export default requireYamllintRulesObjectRule;
