import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createFilenameRule } from "../_internal/config-rule-factories.js";

const requireYamllintConfigFileNamingConventionRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createFilenameRule({
    allowedPattern:
        /(?:^|\/)(\.yamllint(?:\.ya?ml)?|yamllint\.config\.[cm]?[jt]s)$/v,
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
