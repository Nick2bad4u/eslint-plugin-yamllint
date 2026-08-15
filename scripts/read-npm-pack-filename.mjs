import { readFile } from "node:fs/promises";
import * as path from "node:path";

const metadataPath = process.argv[2];

if (metadataPath === undefined) {
    throw new TypeError(
        "Expected the path to npm pack --json metadata as the first argument."
    );
}

/** @type {unknown} */
const packMetadata = JSON.parse(await readFile(metadataPath, "utf8"));
const packRecords = Array.isArray(packMetadata)
    ? packMetadata
    : packMetadata !== null && typeof packMetadata === "object"
      ? Object.values(packMetadata)
      : [];

if (packRecords.length !== 1) {
    throw new TypeError(
        `Expected exactly one npm pack record, received ${packRecords.length}.`
    );
}

const [packRecord] = packRecords;

if (
    packRecord === null ||
    typeof packRecord !== "object" ||
    !("filename" in packRecord) ||
    typeof packRecord.filename !== "string" ||
    packRecord.filename.length === 0
) {
    throw new TypeError("The npm pack record does not contain a filename.");
}

if (
    path.basename(packRecord.filename) !== packRecord.filename ||
    path.win32.basename(packRecord.filename) !== packRecord.filename ||
    !packRecord.filename.endsWith(".tgz")
) {
    throw new TypeError(
        `The npm pack filename is not a safe tarball basename: ${packRecord.filename}`
    );
}

process.stdout.write(packRecord.filename);
