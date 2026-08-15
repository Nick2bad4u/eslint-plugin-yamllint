import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const readerPath = fileURLToPath(
    new URL("../scripts/read-npm-pack-filename.mjs", import.meta.url)
);

const readPackFilename = (metadata: unknown) => {
    const fixtureDirectory = mkdtempSync(
        path.join(tmpdir(), "eslint-plugin-yamllint-pack-metadata-")
    );
    const fixturePath = path.join(fixtureDirectory, "npm-pack.json");

    try {
        writeFileSync(fixturePath, JSON.stringify(metadata), "utf8");

        return spawnSync(process.execPath, [readerPath, fixturePath], {
            cwd: process.cwd(),
            encoding: "utf8",
            windowsHide: true,
        });
    } finally {
        rmSync(fixtureDirectory, { force: true, recursive: true });
    }
};

describe("npm pack metadata reader", () => {
    it("reads the legacy array result shape", () => {
        expect.assertions(2);

        const result = readPackFilename([{ filename: "package-1.2.3.tgz" }]);

        expect(result.status).toBe(0);
        expect(result.stdout).toBe("package-1.2.3.tgz");
    });

    it("reads the npm 12 package-name map result shape", () => {
        expect.assertions(2);

        const result = readPackFilename({
            "eslint-plugin-yamllint": {
                filename: "package-1.2.3.tgz",
            },
        });

        expect(result.status).toBe(0);
        expect(result.stdout).toBe("package-1.2.3.tgz");
    });

    it("rejects ambiguous metadata", () => {
        expect.assertions(2);

        const result = readPackFilename([
            { filename: "first.tgz" },
            { filename: "second.tgz" },
        ]);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain("Expected exactly one npm pack record");
    });

    it("rejects unsafe archive paths", () => {
        expect.assertions(2);

        const result = readPackFilename({
            "eslint-plugin-yamllint": { filename: "../package.tgz" },
        });

        expect(result.status).toBe(1);
        expect(result.stderr).toContain("not a safe tarball basename");
    });
});
