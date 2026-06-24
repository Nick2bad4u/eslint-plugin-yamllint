import { createConfig } from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

const yamllintPlugin = /** @type {import("./src/plugin").YamllintPlugin} */ (
    plugin
);
const configurationPreset = yamllintPlugin.configs.configuration;
if (Array.isArray(configurationPreset))
    throw new TypeError(
        "Expected yamllint.configs.configuration to be a flat config object."
    );
const localConfigurationPreset = /** @type {import("eslint").Linter.Config} */ (
    configurationPreset
);

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...createConfig({
        allowDefaultProjectFilePatterns: [
            "eslint.config.mjs",
            "knip.config.ts",
            "prettier.config.mjs",
            "stylelint.config.mjs",
        ],
        plugins: { yamllint: false },
    }),
    {
        ignores: [
            ".github/workflows/**",
            "dist/**",
            "coverage/**",
            ".cache/**",
            "docs/docusaurus/.docusaurus/**",
            "docs/docusaurus/build/**",
            "docs/docusaurus/site-docs/developer/api/**",
            "docs/docusaurus/static/*-inspector/**",
            "plugin.*",
            "test/**/*.test-d.ts",
            "untyped-third-party-modules.d.ts",
        ],
    },
    { ...localConfigurationPreset, name: "Local Yamllint config rules" },
    {
        files: ["docs/docusaurus/docusaurus.config.ts"],
        name: "Docusaurus build-time configuration",
        rules: {
            "docusaurus-2/require-balanced-footer-link-columns": "off",
            "n/no-process-env": "off",
            "unicorn/consistent-conditional-object-spread": "off",
            "unicorn/no-non-function-verb-prefix": "off",
            "unicorn/no-unnecessary-global-this": "off",
            "unicorn/no-unreadable-new-expression": "off",
            "unicorn/prefer-short-arrow-method": "off",
            "unicorn/prefer-temporal": "off",
            "unicorn/prefer-url-href": "off",
        },
    },
    {
        files: [
            "docs/docusaurus/src/components/GitHubStats.tsx",
            "docs/docusaurus/src/pages/index.tsx",
        ],
        name: "Docusaurus route and React component filenames",
        rules: {
            "canonical/filename-no-index": "off",
            "unicorn/filename-case": "off",
        },
    },
    {
        files: ["docs/docusaurus/src/js/**/*.ts"],
        name: "Docusaurus DOM enhancement scripts",
        rules: {
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/prefer-readonly-parameter-types": "off",
            "listeners/no-missing-remove-event-listener": "off",
            "regexp/require-unicode-sets-regexp": "off",
            "runtime-cleanup/no-unmanaged-event-listeners": "off",
            "unicorn/consistent-boolean-name": "off",
            "unicorn/no-unnecessary-global-this": "off",
            "unicorn/prefer-unicode-code-point-escapes": "off",
        },
    },
    {
        files: ["docs/docusaurus/static/manifest.json"],
        name: "Docusaurus PWA web manifest",
        rules: {
            "json-schema-validator-2/no-invalid": "off",
        },
    },
    {
        files: ["**/*.{md,mdx}"],
        name: "Docusaurus and generated markdown documents",
        rules: {
            "markdown/no-multiple-h1": "off",
        },
    },
    {
        files: ["src/**/*.{ts,tsx,mts,cts}"],
        name: "Bridge implementation documentation and ordering",
        rules: {
            "perfectionist/sort-modules": "off",
            "perfectionist/sort-objects": "off",
            "perfectionist/sort-union-types": "off",
            "tsdoc-require-2/require": "off",
            "typedoc/require-exported-doc-comment": "off",
        },
    },
    {
        files: ["src/_internal/config-rule-factories.ts"],
        name: "Config text rule factories",
        rules: {
            "etc-misc/no-vulnerable": "off",
            "no-duplicate-imports": "off",
            "prefer-named-capture-group": "off",
            "regexp/no-super-linear-move": "off",
            "regexp/prefer-named-capture-group": "off",
            "regexp/require-unicode-sets-regexp": "off",
            "typefest/prefer-ts-extras-array-includes": "off",
            "typefest/prefer-ts-extras-set-has": "off",
            "typefest/prefer-type-fest-except": "off",
        },
    },
    {
        files: [
            "src/_internal/yamllint-worker.ts",
            "src/_internal/yamllint-runner.ts",
            "src/rules/yamllint.ts",
        ],
        name: "Yamllint CLI bridge internals",
        rules: {
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "n/no-sync": "off",
            "no-empty": "off",
            "sdl/no-postmessage-without-origin-allowlist": "off",
            "security/detect-non-literal-fs-filename": "off",
            "typefest/prefer-ts-extras-key-in": "off",
            "unicorn/import-style": "off",
            "unicorn/no-error-property-assignment": "off",
            "unicorn/no-process-exit": "off",
            "unicorn/no-top-level-assignment-in-function": "off",
            "unicorn/require-post-message-target-origin": "off",
            "unicorn/try-complexity": "off",
        },
    },
    {
        files: ["src/rules/**/*.ts"],
        name: "ESLint rule module metadata",
        rules: {
            "eslint-plugin/require-meta-docs-description": "off",
            "eslint-plugin/require-meta-schema-description": "off",
            "prefer-named-capture-group": "off",
            "regexp/prefer-named-capture-group": "off",
            "security/detect-unsafe-regex": "off",
            "unicorn/try-complexity": "off",
        },
    },
    {
        files: ["test/**/*.test.ts", "test/_internal/**/*.ts"],
        name: "Rule and bridge tests",
        rules: {
            "canonical/no-use-extend-native": "off",
            "test-signal/no-weak-existence-assertions": "off",
            "test-signal/require-negative-path": "off",
            "tsdoc-require-2/require": "off",
            "unicorn/import-style": "off",
            "unicorn/no-unreadable-new-expression": "off",
            "unicorn/require-array-sort-compare": "off",
            "vitest/no-hooks": "off",
            "vitest/prefer-expect-assertions": "off",
            "vitest/require-top-level-describe": "off",
        },
    },
];
export default config;
