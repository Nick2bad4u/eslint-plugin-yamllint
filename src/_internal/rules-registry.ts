import disallowYamllintConflictingIgnoreKeysRule from "../rules/disallow-yamllint-conflicting-ignore-keys.js";
import disallowYamllintEmptyIgnorePatternsRule from "../rules/disallow-yamllint-empty-ignore-patterns.js";
import disallowYamllintEmptyRulesObjectRule from "../rules/disallow-yamllint-empty-rules-object.js";
import disallowYamllintUnknownConfigPropertiesRule from "../rules/disallow-yamllint-unknown-config-properties.js";
import preferYamllintYamlFilesArrayRule from "../rules/prefer-yamllint-yaml-files-array.js";
import requireYamllintConfigFileNamingConventionRule from "../rules/require-yamllint-config-file-naming-convention.js";
import requireYamllintRulesObjectRule from "../rules/require-yamllint-rules-object.js";
import requireYamllintValidRuleLevelsRule from "../rules/require-yamllint-valid-rule-levels.js";
import sortYamllintRuleKeysRule from "../rules/sort-yamllint-rule-keys.js";
import yamllintRule from "../rules/yamllint.js";

type YamllintRulesRegistry = Readonly<{
    "disallow-yamllint-conflicting-ignore-keys": typeof disallowYamllintConflictingIgnoreKeysRule;
    "disallow-yamllint-empty-ignore-patterns": typeof disallowYamllintEmptyIgnorePatternsRule;
    "disallow-yamllint-empty-rules-object": typeof disallowYamllintEmptyRulesObjectRule;
    "disallow-yamllint-unknown-config-properties": typeof disallowYamllintUnknownConfigPropertiesRule;
    "prefer-yamllint-yaml-files-array": typeof preferYamllintYamlFilesArrayRule;
    "require-yamllint-config-file-naming-convention": typeof requireYamllintConfigFileNamingConventionRule;
    "require-yamllint-rules-object": typeof requireYamllintRulesObjectRule;
    "require-yamllint-valid-rule-levels": typeof requireYamllintValidRuleLevelsRule;
    "sort-yamllint-rule-keys": typeof sortYamllintRuleKeysRule;
    yamllint: typeof yamllintRule;
}>;

export const yamllintRules: YamllintRulesRegistry = {
    "disallow-yamllint-conflicting-ignore-keys":
        disallowYamllintConflictingIgnoreKeysRule,
    "disallow-yamllint-empty-ignore-patterns":
        disallowYamllintEmptyIgnorePatternsRule,
    "disallow-yamllint-empty-rules-object":
        disallowYamllintEmptyRulesObjectRule,
    "disallow-yamllint-unknown-config-properties":
        disallowYamllintUnknownConfigPropertiesRule,
    "prefer-yamllint-yaml-files-array": preferYamllintYamlFilesArrayRule,
    "require-yamllint-config-file-naming-convention":
        requireYamllintConfigFileNamingConventionRule,
    "require-yamllint-rules-object": requireYamllintRulesObjectRule,
    "require-yamllint-valid-rule-levels": requireYamllintValidRuleLevelsRule,
    "sort-yamllint-rule-keys": sortYamllintRuleKeysRule,
    yamllint: yamllintRule,
} as const satisfies YamllintRulesRegistry;

export type YamllintRuleNamePattern = keyof typeof yamllintRules;

export default yamllintRules;
