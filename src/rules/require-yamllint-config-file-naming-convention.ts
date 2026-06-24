import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createFilenameRule } from "../_internal/config-rule-factories.js";

/**
 * RequireYamllintConfigFileNamingConventionRule ESLint rule contract.
 */
const requireYamllintConfigFileNamingConventionRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createFilenameRule({
    allowedPattern:
        /(?:^|\/)(?:\.yamllint|\.yamllint\.yaml|\.yamllint\.yml|yamllint\.config\.js|yamllint\.config\.mjs|yamllint\.config\.cjs|yamllint\.config\.ts|yamllint\.config\.mts|yamllint\.config\.cts)$/v,
    configs: [
        "yamllint.configs.configuration",
        "yamllint.configs.recommended",
        "yamllint.configs.all",
    ],
    description:
        "require Yamllint config files to use a supported Yamllint config filename.",
    name: "require-yamllint-config-file-naming-convention",
    recommended: true,
});

export default requireYamllintConfigFileNamingConventionRule;
