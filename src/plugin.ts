import type { ESLint, Linter } from "eslint";

import * as yamlParser from "yaml-eslint-parser";

// eslint-disable-next-line import-x/extensions -- Node JSON import attributes require the file extension at runtime.
import packageJson from "../package.json" with { type: "json" };
import { yamllintRules } from "./_internal/rules-registry.js";
import {
    type YamllintConfigName as InternalYamllintConfigName,
    yamllintConfigMetadataByName,
} from "./_internal/yamllint-config-references.js";

/**
 * YamllintConfigName yamllint config name contract.
 */
export type YamllintConfigName = InternalYamllintConfigName;

const pluginName = "eslint-plugin-yamllint" as const;
const pluginNamespace = "yamllint" as const;
const bridgeFiles = ["**/*.{yml,yaml}", "**/.yamllint"] as const;
const configFiles = [
    "**/.yamllint",
    "**/.yamllint.{yml,yaml}",
    "**/yamllint.config.{js,cjs,mjs,ts,mts,cts}",
] as const;

/**
 * YamllintConfig yamllint config contract.
 */
export type YamllintConfig = Linter.Config | readonly Linter.Config[];
/**
 * YamllintConfigs yamllint configs contract.
 */
export type YamllintConfigs = Record<YamllintConfigName, YamllintConfig>;
/**
 * YamllintRuleId yamllint rule id contract.
 */
export type YamllintRuleId = `yamllint/${YamllintRuleName}`;
/**
 * YamllintRuleName yamllint rule name contract.
 */
export type YamllintRuleName = keyof typeof yamllintRules;
type FlatConfigRules = NonNullable<Linter.Config["rules"]>;

const eslintPluginRules: typeof yamllintRules = yamllintRules;
const version =
    typeof packageJson.version === "string" ? packageJson.version : "0.0.0";

/**
 * ESLint plugin object exported by `eslint-plugin-yamllint`.
 */
const yamllintPlugin: {
    configs: YamllintConfigs;
    meta: { name: string; namespace: string; version: string };
    processors: NonNullable<ESLint.Plugin["processors"]>;
    rules: typeof eslintPluginRules;
} = {
    configs: {
        all: [],
        configs: {},
        configuration: {},
        recommended: [],
        yaml: {},
        yamllintOnly: {},
    },
    meta: { name: pluginName, namespace: pluginNamespace, version },
    processors: {},
    rules: eslintPluginRules,
};
const yamllintPluginForEslint =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint's public Plugin type requires mutable option/config arrays, while this package exposes readonly typed rule metadata internally.
    yamllintPlugin as unknown as ESLint.Plugin;

const yamllintOnlyPreset: Linter.Config = {
    files: [...bridgeFiles],

    languageOptions: { parser: yamlParser },
    name: yamllintConfigMetadataByName.yamllintOnly.presetName,
    plugins: { [pluginNamespace]: yamllintPluginForEslint },
    rules: { "yamllint/yamllint": "error" },
};

const configurationRules = {
    "yamllint/disallow-yamllint-conflicting-ignore-keys": "warn",
    "yamllint/disallow-yamllint-empty-ignore-patterns": "warn",
    "yamllint/disallow-yamllint-empty-rules-object": "warn",
    "yamllint/disallow-yamllint-unknown-config-properties": "warn",
    "yamllint/prefer-yamllint-yaml-files-array": "warn",
    "yamllint/require-yamllint-config-file-naming-convention": "warn",
    "yamllint/require-yamllint-rules-object": "warn",
    "yamllint/require-yamllint-valid-rule-levels": "warn",
    "yamllint/sort-yamllint-rule-keys": "warn",
} as const satisfies FlatConfigRules;

const recommendedConfigurationRules = {
    "yamllint/disallow-yamllint-conflicting-ignore-keys": "warn",
    "yamllint/disallow-yamllint-empty-ignore-patterns": "warn",
    "yamllint/disallow-yamllint-empty-rules-object": "warn",
    "yamllint/disallow-yamllint-unknown-config-properties": "warn",
    "yamllint/prefer-yamllint-yaml-files-array": "warn",
    "yamllint/require-yamllint-config-file-naming-convention": "warn",
    "yamllint/require-yamllint-rules-object": "warn",
} as const satisfies FlatConfigRules;

const configurationPreset: Linter.Config = {
    files: [...configFiles],
    languageOptions: {
        parser: yamlParser,
        parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    name: yamllintConfigMetadataByName.configuration.presetName,
    plugins: { [pluginNamespace]: yamllintPluginForEslint },
    rules: configurationRules,
};

const recommendedConfigurationPreset: Linter.Config = {
    ...configurationPreset,
    name: yamllintConfigMetadataByName.recommended.presetName,
    rules: recommendedConfigurationRules,
};

yamllintPlugin.configs = {
    all: [yamllintOnlyPreset, configurationPreset],
    configs: configurationPreset,
    configuration: configurationPreset,
    recommended: [yamllintOnlyPreset, recommendedConfigurationPreset],
    yaml: yamllintOnlyPreset,
    yamllintOnly: yamllintOnlyPreset,
};

/**
 * YamllintPlugin yamllint plugin contract.
 */
export type YamllintPlugin = typeof yamllintPlugin;
export default yamllintPlugin;
