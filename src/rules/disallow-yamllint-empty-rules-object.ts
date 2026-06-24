import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createNoEmptyStringRule } from "../_internal/config-rule-factories.js";

/**
 * DisallowYamllintEmptyRulesObjectRule ESLint rule contract.
 */
const disallowYamllintEmptyRulesObjectRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createNoEmptyStringRule({
    configs: [
        "yamllint.configs.configuration",
        "yamllint.configs.recommended",
        "yamllint.configs.all",
    ],
    description: "disallow empty Yamllint rules objects.",
    name: "disallow-yamllint-empty-rules-object",
    recommended: true,
});

export default disallowYamllintEmptyRulesObjectRule;
