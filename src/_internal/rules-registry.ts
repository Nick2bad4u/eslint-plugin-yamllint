import yamllintConflictingIgnoreKeysRule from "../rules/disallow-yamllint-conflicting-ignore-keys.js";
import yamllintEmptyIgnorePatternsRule from "../rules/disallow-yamllint-empty-ignore-patterns.js";
import yamllintEmptyRulesObjectRule from "../rules/disallow-yamllint-empty-rules-object.js";
import yamllintUnknownConfigPropertiesRule from "../rules/disallow-yamllint-unknown-config-properties.js";
import preferYamllintYamlFilesArrayRule from "../rules/prefer-yamllint-yaml-files-array.js";
import yamllintConfigFileNamingConventionRule from "../rules/require-yamllint-config-file-naming-convention.js";
import yamllintRulesObjectRule from "../rules/require-yamllint-rules-object.js";
import yamllintValidRuleLevelsRule from "../rules/require-yamllint-valid-rule-levels.js";
import sortYamllintRuleKeysRule from "../rules/sort-yamllint-rule-keys.js";
import yamllintRule from "../rules/yamllint.js";

type YamllintRulesRegistry = Readonly<{
    "disallow-yamllint-conflicting-ignore-keys": typeof yamllintConflictingIgnoreKeysRule;
    "disallow-yamllint-empty-ignore-patterns": typeof yamllintEmptyIgnorePatternsRule;
    "disallow-yamllint-empty-rules-object": typeof yamllintEmptyRulesObjectRule;
    "disallow-yamllint-unknown-config-properties": typeof yamllintUnknownConfigPropertiesRule;
    "prefer-yamllint-yaml-files-array": typeof preferYamllintYamlFilesArrayRule;
    "require-yamllint-config-file-naming-convention": typeof yamllintConfigFileNamingConventionRule;
    "require-yamllint-rules-object": typeof yamllintRulesObjectRule;
    "require-yamllint-valid-rule-levels": typeof yamllintValidRuleLevelsRule;
    "sort-yamllint-rule-keys": typeof sortYamllintRuleKeysRule;
    yamllint: typeof yamllintRule;
}>;

/**
 * YamllintRules yamllint rules contract.
 */
export const yamllintRules: YamllintRulesRegistry = {
    "disallow-yamllint-conflicting-ignore-keys":
        yamllintConflictingIgnoreKeysRule,
    "disallow-yamllint-empty-ignore-patterns": yamllintEmptyIgnorePatternsRule,
    "disallow-yamllint-empty-rules-object": yamllintEmptyRulesObjectRule,
    "disallow-yamllint-unknown-config-properties":
        yamllintUnknownConfigPropertiesRule,
    "prefer-yamllint-yaml-files-array": preferYamllintYamlFilesArrayRule,
    "require-yamllint-config-file-naming-convention":
        yamllintConfigFileNamingConventionRule,
    "require-yamllint-rules-object": yamllintRulesObjectRule,
    "require-yamllint-valid-rule-levels": yamllintValidRuleLevelsRule,
    "sort-yamllint-rule-keys": sortYamllintRuleKeysRule,
    yamllint: yamllintRule,
} as const satisfies YamllintRulesRegistry;

/**
 * YamllintRuleNamePattern yamllint rule name pattern contract.
 */
export type YamllintRuleNamePattern = keyof typeof yamllintRules;

export default yamllintRules;
