import type { RuleTester } from "@typescript-eslint/rule-tester";

import { ESLint, type Linter } from "eslint";
import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import { hasConfigProperty } from "../src/_internal/config-rule-factories";
import yamllintPlugin from "../src/plugin";

type RuleWithDocs = Parameters<RuleTester["run"]>[1] & {
    meta: {
        docs: {
            url: string;
        };
    };
};

const isRuleModule = (value: unknown): value is RuleWithDocs =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as { create?: unknown }).create === "function" &&
    typeof (value as { meta?: { docs?: { url?: unknown } } }).meta?.docs
        ?.url === "string";

const configRules = yamllintPlugin.configs.configuration as Linter.Config;
const createConfigRuleEngine = (): ESLint =>
    new ESLint({
        overrideConfig: [
            {
                ...configRules,
                files: ["**/*.{yml,yaml}", "**/.yamllint"],
            },
        ],
        overrideConfigFile: true,
    });

const createTemporaryDirectory = (): string => {
    const temporaryRoot = path.join(process.cwd(), "temp");
    fs.mkdirSync(temporaryRoot, { recursive: true });
    return fs.mkdtempSync(path.join(temporaryRoot, "eslint-plugin-yamllint-"));
};

describe("yamllint config rules", () => {
    it("registers config-authoring rules with docs metadata", () => {
        expect.hasAssertions();
        expect(isRuleModule({})).not.toBe(true);

        for (const [name, rule] of Object.entries(yamllintPlugin.rules)) {
            if (!isRuleModule(rule)) {
                throw new TypeError(
                    `${name} is not a rule module with docs metadata.`
                );
            }

            expect(rule.meta.docs.url).toContain("/docs/rules/");
        }
    });

    it("detects Yamllint config properties across supported syntaxes", () => {
        expect.assertions(4);

        expect(hasConfigProperty("rules:\n  braces: enable\n", "rules")).toBe(
            true
        );
        expect(
            hasConfigProperty(
                "export default { rules: { braces: 'enable' } };",
                "rules"
            )
        ).toBe(true);
        expect(hasConfigProperty('{ "yaml-files": [] }', "yaml-files")).toBe(
            true
        );
        expect(hasConfigProperty("extends: default\n", "rules")).toBe(false);
    });

    it("reports config-authoring problems through the configuration preset", async () => {
        expect.assertions(7);

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText(
            [
                "extends: default",
                "rules:",
                "  trailing-spaces: enable",
                'ignore: ""',
                "unexpected-property: true",
                "",
            ].join("\n"),
            { filePath: "wrong-name.yaml" }
        );

        const messages = result?.messages ?? [];
        const ruleIds = new Set(messages.map((message) => message.ruleId));

        expect(ruleIds).toContain(
            "yamllint/disallow-yamllint-empty-ignore-patterns"
        );
        expect(ruleIds).toContain(
            "yamllint/disallow-yamllint-unknown-config-properties"
        );
        expect(ruleIds).toContain(
            "yamllint/require-yamllint-config-file-naming-convention"
        );
        expect(ruleIds).not.toContain("yamllint/require-yamllint-rules-object");
        expect(messages.some((message) => message.line === 1)).toBe(true);
        expect(messages.map((message) => message.severity)).toStrictEqual(
            expect.arrayContaining([1])
        );
        expect(messages.map((message) => message.message)).toStrictEqual(
            expect.arrayContaining([
                expect.stringContaining("Unexpected top-level config property"),
            ])
        );
    });

    it("accepts valid Yamllint config files", async () => {
        expect.assertions(1);

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText(
            [
                "extends: default",
                "rules:",
                "  trailing-spaces: enable",
                "yaml-files:",
                "  - '*.yaml'",
                "",
            ].join("\n"),
            { filePath: ".yamllint.yaml" }
        );

        expect(result?.messages).toHaveLength(0);
    });

    it("accepts configs that inherit required properties from the default config", async () => {
        expect.assertions(1);

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText("extends: default\n", {
            filePath: path.join(createTemporaryDirectory(), ".yamllint"),
        });

        expect(result?.messages).toHaveLength(0);
    });

    it("accepts configs that inherit required properties from package path extends", async () => {
        expect.assertions(1);

        const temporaryDirectory = createTemporaryDirectory();
        const extendedConfigPath = path.join(
            temporaryDirectory,
            "node_modules",
            "yamllint-config-example",
            ".yamllint"
        );
        fs.mkdirSync(path.dirname(extendedConfigPath), { recursive: true });
        fs.writeFileSync(
            extendedConfigPath,
            [
                "rules:",
                "  trailing-spaces: enable",
                "yaml-files:",
                "  - '*.yaml'",
                "",
            ].join("\n")
        );

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText(
            'extends: "node_modules/yamllint-config-example/.yamllint"\n',
            { filePath: path.join(temporaryDirectory, ".yamllint") }
        );

        expect(result?.messages).toHaveLength(0);
    });

    it("reports required properties missing from both config and package path extends", async () => {
        expect.assertions(2);

        const temporaryDirectory = createTemporaryDirectory();
        const extendedConfigPath = path.join(
            temporaryDirectory,
            "node_modules",
            "yamllint-config-example",
            ".yamllint"
        );
        fs.mkdirSync(path.dirname(extendedConfigPath), { recursive: true });
        fs.writeFileSync(extendedConfigPath, "ignore: generated/**\n");

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText(
            'extends: "node_modules/yamllint-config-example/.yamllint"\n',
            { filePath: path.join(temporaryDirectory, ".yamllint") }
        );
        const ruleIds = new Set(
            (result?.messages ?? []).map((message) => message.ruleId)
        );

        expect(ruleIds.has("yamllint/prefer-yamllint-yaml-files-array")).toBe(
            true
        );
        expect(ruleIds.has("yamllint/require-yamllint-rules-object")).toBe(
            true
        );
    });
});
