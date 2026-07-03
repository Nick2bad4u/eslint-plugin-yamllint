import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

/**
 * YamllintConflictingIgnoreKeysRule ESLint rule contract.
 */
const yamllintConflictingIgnoreKeysRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "yamllint.configs.configuration",
        "yamllint.configs.recommended",
        "yamllint.configs.all",
    ],
    description: "disallow conflicting Yamllint ignore settings.",
    name: "disallow-yamllint-conflicting-ignore-keys",
    propertyName: "rules",
    recommended: true,
});

export default yamllintConflictingIgnoreKeysRule;
