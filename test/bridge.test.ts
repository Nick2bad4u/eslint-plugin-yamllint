import { ESLint, type Linter } from "eslint";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import yamllintPlugin from "../src/plugin";

const bridgeConfig = yamllintPlugin.configs.yamllintOnly as Linter.Config;
const createEngine = (
    ruleOptions: Readonly<Record<string, unknown>> = {}
): ESLint =>
    new ESLint({
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
    it("reports Yamllint diagnostics through ESLint", async () => {
        expect.hasAssertions();

        const temporaryDirectory = mkdtempSync(
            path.join(tmpdir(), "yamllint-bridge-")
        );
        try {
            const configPath = path.join(temporaryDirectory, ".yamllint");
            writeFileSync(
                configPath,
                "---\nextends: default\nrules:\n  trailing-spaces: enable\n"
            );
            const eslint = createEngine({ configFile: configPath });
            const [result] = await eslint.lintText("a: 1  \n", {
                filePath: "sample.yml",
            });

            expect(result).toBeDefined();
            expect(result!.messages.length).toBeGreaterThan(0);
            expect(result!.messages[0]?.ruleId).toBe("yamllint/yamllint");
        } finally {
            rmSync(temporaryDirectory, { force: true, recursive: true });
        }
    }, 30_000);
});
