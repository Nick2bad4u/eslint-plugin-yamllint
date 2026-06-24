import { describe, expect, it } from "vitest";

import { yamllintConfigNames } from "../src/_internal/yamllint-config-references";
import yamllintPlugin from "../src/plugin";

describe("yamllint plugin configs", () => {
    it("exports exactly the supported config keys", () => {
        expect(Object.keys(yamllintPlugin.configs).toSorted()).toStrictEqual(
            [...yamllintConfigNames].toSorted()
        );
    });

    it("keeps aliases wired to preferred preset names", () => {
        expect(yamllintPlugin.configs.yaml).toBe(
            yamllintPlugin.configs.yamllintOnly
        );
        expect(yamllintPlugin.configs.configs).toBe(
            yamllintPlugin.configs.configuration
        );
    });
});
