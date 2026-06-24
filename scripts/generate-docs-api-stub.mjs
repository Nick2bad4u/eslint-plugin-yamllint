import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptsDirectory, "..");
const outputDirectory = resolve(
    repositoryRoot,
    "docs",
    "docusaurus",
    "site-docs",
    "developer",
    "api"
);
const outputPath = resolve(outputDirectory, "index.md");

const markdown =
    `---
title: API
description: Public runtime surface for eslint-plugin-remark.
---

# API

` +
    "`eslint-plugin-remark` intentionally exposes a small public API.\n\n" +
    "## Default export\n\n" +
    "The package default export is the ESLint plugin object. It includes:\n\n" +
    "- `meta.name`\n" +
    "- `meta.namespace`\n" +
    "- `meta.version`\n" +
    "- `rules`\n" +
    "- `configs`\n\n" +
    "## Exported type aliases\n\n" +
    "- `RemarkConfigName`\n" +
    "- `RemarkConfig`\n" +
    "- `RemarkConfigs`\n" +
    "- `RemarkRuleId`\n" +
    "- `RemarkRuleName`\n" +
    "- `RemarkPlugin`\n\n" +
    "## Why this page is hand-authored\n\n" +
    "The public runtime surface of this plugin is small enough that a hand-authored API page is clearer and more stable than a large generated TypeDoc tree for internal helper types.\n";

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, markdown, "utf8");
console.log(`Wrote API docs stub to ${outputPath}`);
