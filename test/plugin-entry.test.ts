import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import yamllintPlugin from "../src/plugin";

const requireFromTestModule = createRequire(import.meta.url);
const packageJson = requireFromTestModule("../package.json") as {
    name: string;
    version: string;
};

describe("plugin entry module", () => {
    it("exports the default plugin object with rule and config registries", () => {
        expect.assertions(3);

        expect(yamllintPlugin.meta).toStrictEqual(
            expect.objectContaining({
                name: "eslint-plugin-yamllint",
                namespace: "yamllint",
                version: packageJson.version,
            })
        );
        expect(Object.keys(yamllintPlugin.rules)).toContain("yamllint");
        expect(yamllintPlugin.rules).not.toHaveProperty("missing-rule");
    });

    it("resolves the package through self-reference CJS require", () => {
        expect.assertions(1);

        const runtimePlugin = requireFromTestModule(packageJson.name) as {
            meta?: { name?: string };
        };

        expect(runtimePlugin.meta?.name).toBe("eslint-plugin-yamllint");
    });
});
