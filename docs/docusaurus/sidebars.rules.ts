import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars = {
    rules: [
        {
            collapsed: false,
            items: [
                "guides/intro",
                "guides/getting-started",
                "guides/yamllint-bridge",
                "guides/config-authoring",
                "guides/faq",
            ],
            label: "Guides",
            type: "category",
        },
        {
            collapsed: false,
            items: [
                "presets/recommended",
                "presets/yamllint-only",
                "presets/configuration",
                "presets/all",
            ],
            label: "Presets",
            link: { id: "presets/index", type: "doc" },
            type: "category",
        },
        {
            collapsed: false,
            items: [
                "yamllint",
                "require-yamllint-config-file-naming-convention",
                "require-yamllint-rules-object",
                "disallow-yamllint-empty-rules-object",
                "disallow-yamllint-unknown-config-properties",
                "disallow-yamllint-conflicting-ignore-keys",
                "prefer-yamllint-yaml-files-array",
                "disallow-yamllint-empty-ignore-patterns",
                "require-yamllint-valid-rule-levels",
                "sort-yamllint-rule-keys",
            ],
            label: "Rules",
            link: {
                slug: "/",
                title: "Rule Reference",
                type: "generated-index",
            },
            type: "category",
        },
    ],
} satisfies SidebarsConfig;
export default sidebars;
