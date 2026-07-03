import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createUnknownPropertiesRule } from "../_internal/config-rule-factories.js";

/**
 * YamllintUnknownConfigPropertiesRule ESLint rule contract.
 */
const yamllintUnknownConfigPropertiesRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createUnknownPropertiesRule({
    allowedProperties: [
        "extends",
        "ignore",
        "ignore-from-file",
        "locale",
        "rules",
        "yaml-files",
    ],
    configs: [
        "yamllint.configs.configuration",
        "yamllint.configs.recommended",
        "yamllint.configs.all",
    ],
    description: "disallow unknown top-level Yamllint config properties.",
    name: "disallow-yamllint-unknown-config-properties",
    recommended: true,
});

export default yamllintUnknownConfigPropertiesRule;
