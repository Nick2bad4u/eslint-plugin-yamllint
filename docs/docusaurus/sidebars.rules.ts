import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars = {
    rules: [
        {
            className: "sb-cat-guides",
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
            className: "sb-cat-presets",
            collapsed: false,
            items: [
                {
                    className: "sb-preset-recommended",
                    id: "presets/recommended",
                    type: "doc",
                },
                {
                    className: "sb-preset-only",
                    id: "presets/yamllint-only",
                    type: "doc",
                },
                {
                    className: "sb-preset-configuration",
                    id: "presets/configuration",
                    type: "doc",
                },
                {
                    className: "sb-preset-all",
                    id: "presets/all",
                    type: "doc",
                },
            ],
            label: "Presets",
            link: { id: "presets/index", type: "doc" },
            type: "category",
        },
        {
            className: "sb-cat-rules",
            collapsed: false,
            items: [
                "yamllint",
                "require-yamllint-config-file-naming-convention",
                "require-yamllint-rules-object",
                "disallow-yamllint-unknown-config-properties",
                "disallow-yamllint-empty-rules-object",
                "disallow-yamllint-empty-ignore-patterns",
                "disallow-yamllint-conflicting-ignore-keys",
                "prefer-yamllint-yaml-files-array",
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
