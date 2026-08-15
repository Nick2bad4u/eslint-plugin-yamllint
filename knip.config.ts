/**
 * Repository-specific configuration for Knip dependency analysis.
 *
 * @packageDocumentation
 */
import type { KnipConfig } from "knip";

/**
 * Knip configuration that scopes entry points and dependency heuristics to the
 * repository layout.
 */
const knipConfig: KnipConfig = {
    $schema: "https://unpkg.com/knip@5/schema.json",
    entry: [],
    ignoreBinaries: [
        // These repository checks are installed as system CLIs rather than npm packages.
        "actionlint",
        "gitleaks",
        "lychee",
    ],
    ignoreDependencies: [
        // Knip cannot infer packages referenced through config paths or Git subcommands.
        "git-cliff",
        "gitcliff-config-nick2bad4u",
        "gitleaks-config-nick2bad4u",
        "jscpd-config-nick2bad4u",
        "lychee-config-nick2bad4u",
        "ncu-config-nick2bad4u",
        "yamllint-config-nick2bad4u",
        // These configs are loaded by non-JavaScript config files that Knip cannot parse.
        "@microsoft/tsdoc-config",
        "tsdoc-config-nick2bad4u",
        "typedoc-config-nick2bad4u",
        // Docusaurus resolves this theme name to its installed search package.
        "@easyops-cn/docusaurus-search-local",
        "@easyops-cn/docusaurus-theme-docusaurus-search-local",
        // Root TypeScript settings are inherited by the docs workspace.
        // The root package emits no JSX or tslib helper import.
        "react",
        "tslib",
    ],
    ignoreExportsUsedInFile: {
        interface: true,
        type: true,
    },
    includeEntryExports: false,
    project: [],
    rules: {
        binaries: "error",
        catalog: "error",
        dependencies: "error",
        devDependencies: "error",
        duplicates: "error",
        enumMembers: "warn",
        exports: "warn",
        files: "error",
        namespaceMembers: "warn",
        nsExports: "warn",
        nsTypes: "warn",
        optionalPeerDependencies: "error",
        types: "warn",
        unlisted: "error",
        unresolved: "error",
    },
    // Analyze the local config as source without expanding dependencies owned by the shared Stylelint preset.
    stylelint: false,
    workspaces: {
        ".": {
            entry: [
                ".secretlintrc.cjs",
                "src/plugin.ts",
                "src/_internal/yamllint-worker.ts",
                "stylelint.config.mjs",
            ],
            project: [
                "src/**/*.{js,ts,tsx,jsx,mts,cjs,cts,mjs}",
                "test/**/*.{js,ts,tsx,jsx,mts,cjs,cts,mjs}",
            ],
        },
    },
};

export default knipConfig;
