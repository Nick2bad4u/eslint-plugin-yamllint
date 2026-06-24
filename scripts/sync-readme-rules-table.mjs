import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import builtPlugin from "../dist/plugin.js";

const rulesSectionHeading = "## Rules";
const presetDocsByName = {
    all: {
        href: "./docs/rules/presets/all.md",
        icon: "🟣",
        publicName: "yamllint.configs.all",
    },
    configuration: {
        href: "./docs/rules/presets/configuration.md",
        icon: "🔧",
        publicName: "yamllint.configs.configuration",
    },
    recommended: {
        href: "./docs/rules/presets/recommended.md",
        icon: "🟡",
        publicName: "yamllint.configs.recommended",
    },
    yamllintOnly: {
        href: "./docs/rules/presets/yamllint-only.md",
        icon: "🧪",
        publicName: "yamllint.configs.yamllintOnly",
    },
};
const presetOrder = [
    "recommended",
    "yamllintOnly",
    "configuration",
    "all",
];

const getBounds = (markdown) => {
    const startOffset = markdown.indexOf(rulesSectionHeading);
    if (startOffset < 0)
        throw new Error("README.md is missing the Rules section.");
    const nextOffset = markdown.indexOf(
        "\n## ",
        startOffset + rulesSectionHeading.length
    );
    return {
        startOffset,
        endOffset: nextOffset < 0 ? markdown.length : nextOffset,
    };
};
const normalize = (value) => value.replaceAll(/\s+/gu, " ").trim();
const ruleEnabled = (presetName, ruleName) => {
    const preset = builtPlugin.configs[presetName];
    const entries = Array.isArray(preset) ? preset : [preset];
    return entries.some(
        (entry) => entry?.rules?.[`yamllint/${ruleName}`] !== undefined
    );
};
const generate = () =>
    [
        "## Rules",
        "",
        "Fix legend:",
        "",
        "- `🔧` = autofixable",
        "- `—` = report only",
        "",
        "Preset key legend:",
        "",
        ...presetOrder.map(
            (name) =>
                `- [\`${presetDocsByName[name].icon}\`](${presetDocsByName[name].href}) — [\`${presetDocsByName[name].publicName}\`](${presetDocsByName[name].href})`
        ),
        "",
        "| Rule | Fix | Preset key |",
        "| --- | :-: | :-- |",
        ...Object.entries(builtPlugin.rules).map(
            ([ruleName, ruleModule]) =>
                `| [\`${ruleName}\`](${ruleModule.meta.docs.url}) | ${ruleModule.meta.fixable === "code" ? "🔧" : "—"} | ${presetOrder
                    .filter((presetName) => ruleEnabled(presetName, ruleName))
                    .map(
                        (presetName) =>
                            `[${presetDocsByName[presetName].icon}](${presetDocsByName[presetName].href})`
                    )
                    .join(" ")} |`
        ),
        "",
    ].join("\n");
export const syncReadmeRulesTable = async ({ writeChanges = false } = {}) => {
    const file = resolve("README.md");
    const markdown = await readFile(file, "utf8");
    const ending = markdown.includes("\r\n") ? "\r\n" : "\n";
    const expected = generate().replaceAll("\n", ending).trimEnd();
    const { startOffset, endOffset } = getBounds(markdown);
    const current = markdown.slice(startOffset, endOffset).trimEnd();
    if (normalize(current) === normalize(expected)) return { changed: false };
    if (!writeChanges)
        throw new Error(
            "README rules table is out of sync with plugin metadata."
        );
    await writeFile(
        file,
        `${markdown.slice(0, startOffset)}${expected}${markdown.slice(endOffset)}`,
        "utf8"
    );
    return { changed: true };
};
if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? "")) {
    await syncReadmeRulesTable({
        writeChanges: process.argv.includes("--write"),
    });
}
