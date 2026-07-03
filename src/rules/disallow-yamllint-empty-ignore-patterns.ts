import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createNoEmptyStringRule } from "../_internal/config-rule-factories.js";

/**
 * YamllintEmptyIgnorePatternsRule ESLint rule contract.
 */
const yamllintEmptyIgnorePatternsRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createNoEmptyStringRule({
    configs: [
        "yamllint.configs.configuration",
        "yamllint.configs.recommended",
        "yamllint.configs.all",
    ],
    description: "disallow empty Yamllint ignore patterns.",
    name: "disallow-yamllint-empty-ignore-patterns",
    recommended: true,
});

export default yamllintEmptyIgnorePatternsRule;
