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
            ".remarkrc.mjs",
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
            "docs/docusaurus/static/manifest.json",
            "docs/docusaurus/site-docs/**",
            "docs/docusaurus/static/*-inspector/**",
            "plugin.*",
            "test/**/*.test-d.ts",
            "untyped-third-party-modules.d.ts",
        ],
    },
    { ...localConfigurationPreset, name: "Local Yamllint config rules" },
];

export default config;
