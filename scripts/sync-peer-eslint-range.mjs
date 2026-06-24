#!/usr/bin/env node

/**
 * Keep selected peer dependency ranges aligned to the currently installed top
 * supported major from matching devDependencies entries, while preserving a
 * stable minimum supported major.
 *
 * Why: npm does not support `$name` indirection in `peerDependencies` (that
 * syntax is supported for `overrides` only), so we synchronize explicit peer
 * ranges after dependency updates.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * The file path to the package.json file, resolved from the current module's
 * URL. This is used to read and update package.json during peer dependency
 * range synchronization.
 *
 * @type {string}
 *
 * @param {string} packageJsonPath - The file path to the package.json file.
 *
 * @see fileURLToPath
 * @see URL
 */
const packageJsonPath = fileURLToPath(
    new URL("../package.json", import.meta.url)
);
/**
 * Peer dependency names that should mirror top supported majors from
 * corresponding devDependencies entries.
 *
 * @type {readonly string[]}
 */
const synchronizedPeerDependencyNames = [
    "eslint",
    "remark",
    "typescript",
];

/**
 * Stable minimum supported peer ranges by dependency.
 *
 * @type {Readonly<Record<string, string>>}
 */
const minimumSupportedPeerRanges = {
    eslint: "^9.0.0",
    remark: "^15.0.0",
    typescript: "^5.0.0",
};

/**
 * Check whether a character is an ASCII digit.
 *
 * @type {(character: string) => boolean}
 *
 * @param {string} character
 *
 * @returns {boolean}
 */
const isAsciiDigit = (character) => character >= "0" && character <= "9";

/**
 * Check whether a string contains only ASCII digits.
 *
 * @type {(value: string) => boolean}
 *
 * @param {string} value
 *
 * @returns {boolean}
 */
const isDigitsOnly = (value) => {
    if (value.length === 0) {
        return false;
    }

    for (const character of value) {
        if (!isAsciiDigit(character)) {
            return false;
        }
    }

    return true;
};

/**
 * Extract a semver core (`major.minor.patch`) token from a range candidate.
 *
 * @type {(rangeCandidate: string) => readonly [string, string, string]}
 *
 * @param {string} rangeCandidate
 *
 * @returns {readonly [string, string, string]}
 *
 * @throws {TypeError} When no valid semver core token can be discovered.
 */
const extractSemverCoreParts = (rangeCandidate) => {
    /** @type {number} */
    let startIndex = -1;

    for (const [index, character] of rangeCandidate.split("").entries()) {
        if (isAsciiDigit(character)) {
            startIndex = index;
            break;
        }
    }

    if (startIndex < 0) {
        throw new TypeError(
            `Unable to resolve top supported major from range: ${rangeCandidate}`
        );
    }

    /** @type {number} */
    let endIndex = startIndex;

    for (let index = startIndex; index < rangeCandidate.length; index += 1) {
        const character = rangeCandidate.at(index);

        if (typeof character !== "string") {
            break;
        }

        if (character === "." || isAsciiDigit(character)) {
            endIndex = index + 1;
            continue;
        }

        break;
    }

    /** @type {string} */
    const semverCore = rangeCandidate.slice(startIndex, endIndex);
    /** @type {string[]} */
    const semverCoreParts = semverCore.split(".");

    if (semverCoreParts.length < 3) {
        throw new TypeError(
            `Unable to resolve top supported major from range: ${rangeCandidate}`
        );
    }

    /** @type {string} */
    const majorVersion = semverCoreParts[0] ?? "";
    /** @type {string} */
    const minorVersion = semverCoreParts[1] ?? "";
    /** @type {string} */
    const patchVersion = semverCoreParts[2] ?? "";

    if (
        !isDigitsOnly(majorVersion) ||
        !isDigitsOnly(minorVersion) ||
        !isDigitsOnly(patchVersion)
    ) {
        throw new TypeError(
            `Unable to resolve top supported major from range: ${rangeCandidate}`
        );
    }

    return [
        majorVersion,
        minorVersion,
        patchVersion,
    ];
};

/**
 * Read and parse package.json.
 *
 * @type {() => Promise<Record<string, unknown>>}
 *
 * @returns {Promise<Record<string, unknown>>}
 *
 * @throws {TypeError} If reading or parsing package.json fails, an error is
 *   thrown with a descriptive message.
 *
 * @see readFile
 * @see fileURLToPath
 */
const readPackageJson = async () => {
    try {
        /** @type {string} */
        const packageJsonContent = await readFile(packageJsonPath, "utf8");
        /** @type {Record<string, unknown>} */
        return JSON.parse(packageJsonContent);
        /** @type {Error} */
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new TypeError(
            `Failed to read package.json at ${packageJsonPath}: ${message}`,
            { cause: error }
        );
    }
};

/**
 * Normalize a semver-ish range to a caret range pinned to the detected major.
 *
 * Examples:
 *
 * - `^17.9.0` -> `^17.0.0`
 * - `>=22.0.0` -> `^22.0.0`
 * - `~10.2.1` -> `^10.0.0`
 *
 * @type {(rangeExpression: string) => string}
 *
 * @param {string} rangeExpression
 *
 * @returns {string}
 *
 * @throws {TypeError} When no major version can be parsed from the input.
 */
const toTopSupportedMajorRange = (rangeExpression) => {
    /** @type {string[]} */
    const candidates = rangeExpression
        .split("||")
        .map((candidate) => candidate.trim())
        .filter(Boolean);

    /** @type {string | undefined} */
    const topCandidate = candidates.at(-1);

    if (typeof topCandidate !== "string") {
        throw new TypeError(
            `Expected a non-empty semver range expression, received: ${rangeExpression}`
        );
    }

    /** @type {readonly [string, string, string]} */
    const [majorVersion] = extractSemverCoreParts(topCandidate);

    return `^${majorVersion}.0.0`;
};

/**
 * Check whether an unknown runtime value is a non-null object record.
 *
 * @type {(value: unknown) => value is Record<string, unknown>}
 *
 * @param {unknown} value
 *
 * @returns {value is Record<string, unknown>}
 *
 * @throws {TypeError} If the value is not a non-null object, an error is thrown
 *   with a descriptive message.
 */
const isRecord = (value) => typeof value === "object" && value !== null;

const main = async () => {
    /** @type {Record<string, unknown>} */
    const packageJson = await readPackageJson();

    /** @type {unknown} */
    const devDependencies = packageJson["devDependencies"];
    /** @type {unknown} */
    const peerDependencies = packageJson["peerDependencies"];

    if (!isRecord(devDependencies) || !isRecord(peerDependencies)) {
        /** @type {string} */
        throw new TypeError(
            "Expected package.json to include object-valued devDependencies and peerDependencies"
        );
    }

    /** @type {string[]} */
    const updatedDependencyNames = [];

    for (const dependencyName of synchronizedPeerDependencyNames) {
        /** @type {unknown} */
        const devDependencyRange = devDependencies[dependencyName];

        if (
            typeof devDependencyRange !== "string" ||
            devDependencyRange.length === 0
        ) {
            continue;
        }

        /** @type {string} */
        const topSupportedRange = toTopSupportedMajorRange(devDependencyRange);
        /** @type {string | undefined} */
        const minimumSupportedRange =
            minimumSupportedPeerRanges[dependencyName];

        if (typeof minimumSupportedRange !== "string") {
            continue;
        }

        /** @type {string} */
        const floorSupportedRange = minimumSupportedRange;
        /** @type {string} */
        const nextPeerRange =
            floorSupportedRange === topSupportedRange
                ? topSupportedRange
                : `${floorSupportedRange} || ${topSupportedRange}`;

        if (peerDependencies[dependencyName] === nextPeerRange) {
            continue;
        }

        peerDependencies[dependencyName] = nextPeerRange;
        updatedDependencyNames.push(dependencyName);
    }

    if (updatedDependencyNames.length === 0) {
        console.log(
            "peerDependencies already aligned to floor+top supported major ranges"
        );
        return;
    }

    try {
        await writeFile(
            packageJsonPath,
            `${JSON.stringify(packageJson, null, 4)}\n`,
            "utf8"
        );

        for (const dependencyName of updatedDependencyNames) {
            /** @type {unknown} */
            const nextPeerRange = peerDependencies[dependencyName];

            if (typeof nextPeerRange !== "string") {
                throw new TypeError(
                    `Expected peerDependencies.${dependencyName} to be a string after synchronization.`
                );
            }

            console.log(
                `Updated peerDependencies.${dependencyName} to: ${nextPeerRange}`
            );
        }
    } catch (error) {
        throw new TypeError(
            `Failed to write updated package.json with synchronized peerDependencies: ${error}`,
            { cause: error }
        );
    }
};

/**
 * Execute the synchronization process, handling any errors gracefully. Errors
 * are logged to the console, and the process exits with a non-zero code to
 * indicate failure.
 *
 * @type {() => Promise<void>}
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} If any step of the synchronization process fails, an error is
 *   thrown with a descriptive message.
 * @throws {TypeError} If reading or writing package.json fails, or if the
 *   expected structure of package.json is not met.
 *
 * @see writeFile
 * @see readPackageJson
 * @see isRecord
 * @see toTopSupportedMajorRange
 * @see main
 */
try {
    await main();
} catch (error) {
    console.error("Failed to synchronize peer dependency ranges:", error);
    /** @type {number} */
    process.exitCode = 1;
}
