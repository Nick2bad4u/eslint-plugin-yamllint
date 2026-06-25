import { ESLint, type Linter } from "eslint";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import yamllintPlugin from "../src/plugin";

const bridgeConfig = yamllintPlugin.configs.yamllintOnly as Linter.Config;
const fixturesDirectory = fileURLToPath(
    new URL("fixtures/bridge/", import.meta.url)
);

const usingTemporaryDirectory = async <Result>(
    prefix: string,
    callback: (temporaryDirectory: string) => Promise<Result>
): Promise<Result> => {
    const temporaryDirectory = mkdtempSync(path.join(tmpdir(), prefix));
    try {
        return await callback(temporaryDirectory);
    } finally {
        rmSync(temporaryDirectory, { force: true, recursive: true });
    }
};
const createEngine = (
    ruleOptions: Readonly<Record<string, unknown>> = {},
    cwd?: string
): ESLint =>
    new ESLint({
        ...(cwd !== undefined && { cwd }),
        overrideConfig: [
            {
                ...bridgeConfig,
                rules: {
                    "yamllint/yamllint": ["error", ruleOptions],
                },
            },
        ],
        overrideConfigFile: true,
    });

describe("yamllint bridge rule", () => {
    it("accepts valid YAML files without diagnostics", async () => {
        expect.assertions(1);

        await usingTemporaryDirectory(
            "yamllint-bridge-clean-",
            async (temporaryDirectory) => {
                const configPath = path.join(temporaryDirectory, ".yamllint");
                writeFileSync(
                    configPath,
                    "---\nextends: default\nrules:\n  trailing-spaces: enable\n"
                );
                const eslint = createEngine({
                    configFile: configPath,
                    noWarnings: false,
                    strict: false,
                    timeoutMs: 30_000,
                });
                const [result] = await eslint.lintText("---\na: 1\n", {
                    filePath: "sample.yml",
                });

                expect(result?.messages).toHaveLength(0);
            }
        );
    }, 30_000);

    it("lints YAML fixture files from disk with forwarded options", async () => {
        expect.assertions(3);

        const eslint = createEngine(
            {
                configFile: path.join(fixturesDirectory, ".yamllint"),
                noWarnings: false,
                strict: false,
                timeoutMs: 30_000,
            },
            fixturesDirectory
        );
        const results = await eslint.lintFiles(["invalid.yaml", "valid.yaml"]);
        const messagesByBasename = new Map(
            results.map((result) => [
                path.basename(result.filePath),
                result.messages,
            ])
        );
        const invalidMessages = messagesByBasename.get("invalid.yaml") ?? [];

        expect(messagesByBasename.get("valid.yaml")).toHaveLength(0);
        expect(invalidMessages.length).toBeGreaterThan(0);
        expect(invalidMessages[0]?.ruleId).toBe("yamllint/yamllint");
    }, 30_000);

    it("reports Yamllint diagnostics through ESLint", async () => {
        expect.assertions(3);

        await usingTemporaryDirectory(
            "yamllint-bridge-",
            async (temporaryDirectory) => {
                const configPath = path.join(temporaryDirectory, ".yamllint");
                writeFileSync(
                    configPath,
                    "---\nextends: default\nrules:\n  trailing-spaces: enable\n"
                );
                const eslint = createEngine({ configFile: configPath });
                const [result] = await eslint.lintText("a: 1  \n", {
                    filePath: "sample.yml",
                });

                expect(result?.messages).not.toHaveLength(0);
                expect(result?.messages[0]?.ruleId).toBe("yamllint/yamllint");
                expect(result?.messages[0]?.message).toStrictEqual(
                    expect.any(String)
                );
            }
        );
    }, 30_000);

    it("reports Yamllint execution failures as configuration errors", async () => {
        expect.assertions(2);

        const eslint = createEngine({
            configFile: "missing-yamllint-config.yaml",
        });
        const [result] = await eslint.lintText("a: 1\n", {
            filePath: "sample.yml",
        });

        expect(result?.messages[0]?.ruleId).toBe("yamllint/yamllint");
        expect(result?.messages[0]?.message).toContain(
            "Yamllint configuration error"
        );
    }, 30_000);
});
