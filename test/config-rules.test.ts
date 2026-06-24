import type { RuleTester } from "@typescript-eslint/rule-tester";

import { describe, expect, it } from "vitest";

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
});
