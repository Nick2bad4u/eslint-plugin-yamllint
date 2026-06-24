// @ts-check

/** Remove files or directories recursively without third-party CLIs. */
import { rm } from "node:fs/promises";
import path from "node:path";

/**
 * @param {string} rawPath
 *
 * @returns {string | undefined}
 */
const normalizePathArgument = (rawPath) => {
    const trimmedPath = rawPath.trim();

    if (trimmedPath.length === 0) {
        return undefined;
    }

    const appData = process.env["APPDATA"] ?? "";
    const withResolvedAppData = trimmedPath.replaceAll("%appdata%", appData);

    return withResolvedAppData
        .replace(/[/\\]\.\*\*$/u, "")
        .replace(/[/\\]\*\*$/u, "");
};

/**
 * @param {unknown} value
 *
 * @returns {value is string}
 */
const isDefinedString = (value) => typeof value === "string";

/**
 * @param {string} targetPath
 *
 * @returns {Promise<void>}
 */
const removeTargetPath = async (targetPath) => {
    const absolutePath = path.resolve(targetPath);

    await rm(absolutePath, {
        force: true,
        maxRetries: 3,
        recursive: true,
        retryDelay: 100,
    });
};

const main = async () => {
    const targetPaths = process.argv
        .slice(2)
        .map(normalizePathArgument)
        .filter(isDefinedString);

    for (const targetPath of targetPaths) {
        await removeTargetPath(targetPath);
    }
};

await main();
