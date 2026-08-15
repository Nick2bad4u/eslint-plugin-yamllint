import jsonPlugin from "@eslint/json";
import { ESLint, type Linter } from "eslint";
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

    it("limits every public rule to ESLint's JavaScript language model", () => {
        expect.assertions(1);

        expect(
            Object.values(yamllintPlugin.rules).map(
                (rule) => rule.meta.languages
            )
        ).toStrictEqual(
            Object.values(yamllintPlugin.rules).map(() => ["js/js"])
        );
    });

    it("composes exported presets with ESLint's JSON languages", async () => {
        expect.assertions(6);

        const recommendedConfig = yamllintPlugin.configs.recommended;
        const eslint = new ESLint({
            overrideConfig: [
                {
                    files: ["**/*.json"],
                    language: "json/json",
                    plugins: { json: jsonPlugin },
                },
                {
                    files: ["**/*.jsonc"],
                    language: "json/jsonc",
                    plugins: { json: jsonPlugin },
                },
                {
                    files: ["**/*.json5"],
                    language: "json/json5",
                    plugins: { json: jsonPlugin },
                },
                ...(isConfigArray(recommendedConfig)
                    ? recommendedConfig
                    : [recommendedConfig]),
            ],
            overrideConfigFile: true,
        });
        const fixtures = [
            { code: "{fixture: true}\n", filePath: "fixture.json5" },
            {
                code: '{"fixture": true // comment\n}\n',
                filePath: "fixture.jsonc",
            },
            { code: '{"fixture": true}\n', filePath: "fixture.json" },
        ] as const;

        for (const fixture of fixtures) {
            const [result] = await eslint.lintText(fixture.code, {
                filePath: fixture.filePath,
            });

            expect(result?.fatalErrorCount).toBe(0);

            expect(
                result?.messages.some(
                    (message) =>
                        message.ruleId?.startsWith("yamllint/") === true
                )
            ).toBe(false);
        }
    });
});
