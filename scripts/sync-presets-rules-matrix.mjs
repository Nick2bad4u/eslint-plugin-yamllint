import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { format } from "prettier";

import builtPlugin from "../dist/plugin.js";
import { normalizeMarkdownTableSpacing } from "./_internal/markdown-tables.mjs";
import { preferredRuleOrder } from "./_internal/preferred-rule-order.mjs";

const matrixSectionHeading = "## Rule matrix";
const presetIndexPath = resolve("docs", "rules", "presets", "index.md");
const generatedMatrixStartMarker =
    "<!-- GENERATED_PRESET_RULES_MATRIX_START -->";
const generatedMatrixEndMarker = "<!-- GENERATED_PRESET_RULES_MATRIX_END -->";
const pluginNamespace = builtPlugin.meta?.namespace ?? "yamllint";
const presetDocsByName = {
    all: {
        href: "./all.md",
        icon: "🟣",
        path: resolve("docs", "rules", "presets", "all.md"),
        publicName: "yamllint.configs.all",
    },
    configuration: {
        href: "./configuration.md",
        icon: "🔧",
        path: resolve("docs", "rules", "presets", "configuration.md"),
        publicName: "yamllint.configs.configuration",
    },
    recommended: {
        href: "./recommended.md",
        icon: "🟡",
        path: resolve("docs", "rules", "presets", "recommended.md"),
        publicName: "yamllint.configs.recommended",
    },
    yamllintOnly: {
        href: "./yamllint-only.md",
        icon: "🧪",
        path: resolve("docs", "rules", "presets", "yamllint-only.md"),
        publicName: "yamllint.configs.yamllintOnly",
    },
};

/** @typedef {keyof typeof presetDocsByName} PresetDisplayName */

/** @type {readonly PresetDisplayName[]} */
const presetOrder = [
    "recommended",
    "yamllintOnly",
    "configuration",
    "all",
];

/** @param {string} markdown */
const detectLineEnding = (markdown) =>
    markdown.includes("\r\n") ? "\r\n" : "\n";

/**
 * @param {string} markdown
 *
 * @returns {{ endOffset: number; startOffset: number }}
 */
const getMatrixSectionBounds = (markdown) => {
    const startOffset = markdown.indexOf(matrixSectionHeading);

    if (startOffset < 0) {
        throw new Error("Preset index is missing the Rule matrix section.");
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + matrixSectionHeading.length
    );

    return {
        endOffset: nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset,
        startOffset,
    };
};

/**
 * @param {string} markdown
 * @param {string} filePath
 *
 * @returns {{ endOffset: number; startOffset: number }}
 */
const getGeneratedMatrixBounds = (markdown, filePath) => {
    const startMarkerOffset = markdown.indexOf(generatedMatrixStartMarker);

    if (startMarkerOffset < 0) {
        throw new Error(
            `${filePath} is missing the '${generatedMatrixStartMarker}' marker.`
        );
    }

    const endMarkerOffset = markdown.indexOf(
        generatedMatrixEndMarker,
        startMarkerOffset + generatedMatrixStartMarker.length
    );

    if (endMarkerOffset < 0) {
        throw new Error(
            `${filePath} is missing the '${generatedMatrixEndMarker}' marker.`
        );
    }

    return {
        endOffset: endMarkerOffset + generatedMatrixEndMarker.length,
        startOffset: startMarkerOffset,
    };
};

const sortedRules = Object.entries(builtPlugin.rules).toSorted(
    ([left], [right]) => {
        const leftIndex = preferredRuleOrder.indexOf(left);
        const rightIndex = preferredRuleOrder.indexOf(right);

        if (leftIndex >= 0 && rightIndex >= 0) {
            return leftIndex - rightIndex;
        }

        if (leftIndex >= 0) {
            return -1;
        }

        if (rightIndex >= 0) {
            return 1;
        }

        return left.localeCompare(right);
    }
);

/**
 * @param {PresetDisplayName} presetName
 * @param {string} ruleName
 */
const ruleEnabled = (presetName, ruleName) => {
    const preset = builtPlugin.configs[presetName];
    const entries = Array.isArray(preset) ? preset : [preset];

    return entries.some(
        (entry) =>
            entry?.rules?.[`${pluginNamespace}/${ruleName}`] !== undefined
    );
};

/** @param {string} ruleName */
const getPresetNamesForRule = (ruleName) =>
    presetOrder.filter((presetName) => ruleEnabled(presetName, ruleName));

/** @param {PresetDisplayName} presetName */
const toPresetMarkdownLink = (presetName) => {
    const preset = presetDocsByName[presetName];

    return `[${preset.icon}](${preset.href})`;
};

/** @param {PresetDisplayName} presetName */
const toPresetLegendLine = (presetName) => {
    const preset = presetDocsByName[presetName];

    return `- [\`${preset.icon}\`](${preset.href}) — [\`${preset.publicName}\`](${preset.href})`;
};

/** @param {PresetDisplayName[]} presetNames */
const toPresetLinks = (presetNames) =>
    presetNames.map(toPresetMarkdownLink).join(" ");

/**
 * @param {PresetDisplayName} presetName
 * @param {string} ruleName
 */
const toPresetStatus = (presetName, ruleName) =>
    ruleEnabled(presetName, ruleName)
        ? `${presetDocsByName[presetName].icon} Enabled`
        : "—";

export const generatePresetsRulesMatrixSectionFromRules = () =>
    [
        "## Rule matrix",
        "",
        "Fix legend:",
        "",
        "- `🔧` = autofixable",
        "- `—` = report only",
        "",
        "Preset key legend:",
        "",
        ...presetOrder.map(toPresetLegendLine),
        "",
        "| Rule | Fix | Preset key |",
        "| --- | :-: | :-- |",
        ...sortedRules.map(([name, rule]) => {
            const docsUrl = rule.meta?.docs?.url;

            if (typeof docsUrl !== "string") {
                throw new TypeError(`Rule '${name}' is missing meta.docs.url.`);
            }

            return `| [\`${name}\`](${docsUrl}) | ${rule.meta.fixable === "code" ? "🔧" : "—"} | ${toPresetLinks(
                getPresetNamesForRule(name)
            )} |`;
        }),
        "",
    ].join("\n");

/** @param {PresetDisplayName} presetName */
export const generatePresetDetailMatrixSectionFromRules = (presetName) => {
    const preset = presetDocsByName[presetName];

    return [
        generatedMatrixStartMarker,
        "",
        `This table is generated from runtime plugin metadata for \`${preset.publicName}\`.`,
        "",
        "Fix legend:",
        "",
        "- `🔧` = autofixable",
        "- `—` = report only",
        "",
        "| Rule | Fix | This preset | Also enabled in |",
        "| --- | :-: | :-- | :-- |",
        ...sortedRules.map(([name, rule]) => {
            const docsUrl = rule.meta?.docs?.url;

            if (typeof docsUrl !== "string") {
                throw new TypeError(`Rule '${name}' is missing meta.docs.url.`);
            }

            const otherPresetNames = getPresetNamesForRule(name).filter(
                (candidate) => candidate !== presetName
            );

            return `| [\`${name}\`](${docsUrl}) | ${rule.meta.fixable === "code" ? "🔧" : "—"} | ${toPresetStatus(
                presetName,
                name
            )} | ${otherPresetNames.length > 0 ? toPresetLinks(otherPresetNames) : "—"} |`;
        }),
        "",
        generatedMatrixEndMarker,
    ].join("\n");
};

/** @param {string} markdown */
export const extractPresetsMatrixSection = (markdown) => {
    const { endOffset, startOffset } = getMatrixSectionBounds(markdown);

    return markdown.slice(startOffset, endOffset);
};

/**
 * @param {PresetDisplayName} presetName
 * @param {string} markdown
 */
export const extractPresetDetailMatrixSection = (presetName, markdown) => {
    const preset = presetDocsByName[presetName];
    const { endOffset, startOffset } = getGeneratedMatrixBounds(
        markdown,
        preset.path
    );

    return markdown.slice(startOffset, endOffset);
};

const syncPresetDetailMatrices = async ({ writeChanges = false } = {}) => {
    let changed = false;

    for (const presetName of presetOrder) {
        const preset = presetDocsByName[presetName];
        const markdown = await readFile(preset.path, "utf8");
        const ending = detectLineEnding(markdown);
        const expected = (
            await format(
                generatePresetDetailMatrixSectionFromRules(presetName),
                {
                    parser: "markdown",
                }
            )
        )
            .replaceAll("\n", ending)
            .trimEnd();
        const { endOffset, startOffset } = getGeneratedMatrixBounds(
            markdown,
            preset.path
        );
        const current = markdown.slice(startOffset, endOffset).trimEnd();

        if (
            normalizeMarkdownTableSpacing(current) ===
            normalizeMarkdownTableSpacing(expected)
        ) {
            continue;
        }

        if (!writeChanges) {
            throw new Error(
                `${preset.path} preset matrix is out of sync with plugin metadata.`
            );
        }

        await writeFile(
            preset.path,
            `${markdown.slice(0, startOffset)}${expected}${markdown.slice(
                endOffset
            )}`,
            "utf8"
        );
        changed = true;
    }

    return { changed };
};

export const syncPresetsRulesMatrix = async ({ writeChanges = false } = {}) => {
    const markdown = await readFile(presetIndexPath, "utf8");
    const ending = detectLineEnding(markdown);
    const expected = (
        await format(generatePresetsRulesMatrixSectionFromRules(), {
            parser: "markdown",
        })
    )
        .replaceAll("\n", ending)
        .trimEnd();
    const { endOffset, startOffset } = getMatrixSectionBounds(markdown);
    const current = markdown.slice(startOffset, endOffset).trimEnd();
    let changed = false;

    if (
        normalizeMarkdownTableSpacing(current) !==
        normalizeMarkdownTableSpacing(expected)
    ) {
        if (!writeChanges) {
            throw new Error(
                "Presets matrix is out of sync with plugin metadata."
            );
        }

        await writeFile(
            presetIndexPath,
            `${markdown.slice(0, startOffset)}${expected}${markdown.slice(
                endOffset
            )}`,
            "utf8"
        );
        changed = true;
    }

    const presetDetailResult = await syncPresetDetailMatrices({ writeChanges });

    return { changed: changed || presetDetailResult.changed };
};

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? "")) {
    await syncPresetsRulesMatrix({
        writeChanges: process.argv.includes("--write"),
    });
}
