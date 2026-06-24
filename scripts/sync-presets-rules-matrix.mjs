import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { format } from "prettier";

import builtPlugin from "../dist/plugin.js";

const presetIndexPath = resolve("docs", "rules", "presets", "index.md");
const presetDocsByName = {
    all: { href: "./all.md", icon: "🟣", publicName: "yamllint.configs.all" },
    configuration: {
        href: "./configuration.md",
        icon: "🔧",
        publicName: "yamllint.configs.configuration",
    },
    recommended: {
        href: "./recommended.md",
        icon: "🟡",
        publicName: "yamllint.configs.recommended",
    },
    yamllintOnly: {
        href: "./yamllint-only.md",
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
const ruleEnabled = (presetName, ruleName) => {
    const preset = builtPlugin.configs[presetName];
    const entries = Array.isArray(preset) ? preset : [preset];
    return entries.some(
        (entry) => entry?.rules?.[`yamllint/${ruleName}`] !== undefined
    );
};
const generate = () =>
    [
        "## Rule matrix",
        "",
        "| Rule | Fix | Preset key |",
        "| --- | :-: | :-- |",
        ...Object.entries(builtPlugin.rules).map(
            ([name, rule]) =>
                `| [\`${name}\`](${rule.meta.docs.url}) | ${rule.meta.fixable === "code" ? "🔧" : "—"} | ${presetOrder
                    .filter((presetName) => ruleEnabled(presetName, name))
                    .map(
                        (presetName) =>
                            `[${presetDocsByName[presetName].icon}](${presetDocsByName[presetName].href})`
                    )
                    .join(" ")} |`
        ),
        "",
    ].join("\n");
export const syncPresetsRulesMatrix = async ({ writeChanges = false } = {}) => {
    const markdown = await readFile(presetIndexPath, "utf8");
    const ending = markdown.includes("\r\n") ? "\r\n" : "\n";
    const expected = (await format(generate(), { parser: "markdown" }))
        .replaceAll("\n", ending)
        .trimEnd();
    const startOffset = markdown.indexOf("## Rule matrix");
    if (startOffset < 0)
        throw new Error("Preset index is missing the Rule matrix section.");
    const current = markdown.slice(startOffset).trimEnd();
    if (current.replaceAll(/\s+/gu, " ") === expected.replaceAll(/\s+/gu, " "))
        return { changed: false };
    if (!writeChanges)
        throw new Error("Presets matrix is out of sync with plugin metadata.");
    await writeFile(
        presetIndexPath,
        `${markdown.slice(0, startOffset)}${expected}`,
        "utf8"
    );
    return { changed: true };
};
if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? "")) {
    await syncPresetsRulesMatrix({
        writeChanges: process.argv.includes("--write"),
    });
}
