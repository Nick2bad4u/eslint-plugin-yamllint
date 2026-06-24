import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

import { yamllintConfigNames } from "../src/_internal/yamllint-config-references";
import yamllintPlugin, { type YamllintConfig } from "../src/plugin";

const toNameSet = (values: Iterable<string>): ReadonlySet<string> =>
    new Set(values);

const isConfigArray = (
    config: YamllintConfig
): config is readonly Linter.Config[] => Array.isArray(config);

const enabledRules = (configName: "all" | "recommended"): readonly string[] =>
    (isConfigArray(yamllintPlugin.configs[configName])
        ? yamllintPlugin.configs[configName]
        : [yamllintPlugin.configs[configName]]
    ).flatMap((config) => Object.keys(config.rules ?? {}));

describe("yamllint plugin configs", () => {
    it("exports exactly the supported config keys", () => {
        expect.assertions(1);

        expect(toNameSet(Object.keys(yamllintPlugin.configs))).toStrictEqual(
            toNameSet(yamllintConfigNames)
        );
    });

    it("keeps aliases wired to preferred preset names", () => {
        expect.assertions(2);

        expect(yamllintPlugin.configs.yaml).toBe(
            yamllintPlugin.configs.yamllintOnly
        );
        expect(yamllintPlugin.configs.configs).toBe(
            yamllintPlugin.configs.configuration
        );
    });

    it("keeps recommended narrower than all", () => {
        expect.assertions(4);

        expect(toNameSet(enabledRules("recommended"))).toStrictEqual(
            toNameSet([
                "yamllint/disallow-yamllint-conflicting-ignore-keys",
                "yamllint/disallow-yamllint-empty-ignore-patterns",
                "yamllint/disallow-yamllint-empty-rules-object",
                "yamllint/disallow-yamllint-unknown-config-properties",
                "yamllint/prefer-yamllint-yaml-files-array",
                "yamllint/require-yamllint-config-file-naming-convention",
                "yamllint/require-yamllint-rules-object",
                "yamllint/yamllint",
            ])
        );
        expect(enabledRules("all")).toContain(
            "yamllint/require-yamllint-valid-rule-levels"
        );
        expect(enabledRules("all")).toContain(
            "yamllint/sort-yamllint-rule-keys"
        );
        expect(enabledRules("recommended")).not.toContain(
            "yamllint/sort-yamllint-rule-keys"
        );
    });
});
