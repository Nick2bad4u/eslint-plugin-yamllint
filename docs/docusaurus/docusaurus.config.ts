import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";

import { themes as prismThemes } from "prism-react-renderer";

const organizationName = "Nick2bad4u";
const projectName = "eslint-plugin-yamllint";
const baseUrl =
    process.env["DOCUSAURUS_BASE_URL"] ?? "/eslint-plugin-yamllint/";
const siteOrigin = "https://nick2bad4u.github.io";

const config = {
    baseUrl,
    favicon: "img/favicon.ico",
    i18n: { defaultLocale: "en", locales: ["en"] },
    organizationName,
    plugins: [
        [
            "@docusaurus/plugin-content-docs",
            {
                editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/`,
                id: "rules",
                path: "../rules",
                routeBasePath: "docs/rules",
                sidebarPath: "./sidebars.rules.ts",
            },
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: false,
                docs: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    path: "site-docs",
                    routeBasePath: "docs",
                    sidebarPath: "./sidebars.ts",
                },
                theme: { customCss: "./src/css/custom.css" },
            } satisfies Preset.Options,
        ],
    ],
    projectName,
    tagline: "Run Yamllint through ESLint.",
    themeConfig: {
        navbar: {
            items: [
                { label: "Docs", position: "left", to: "/docs" },
                {
                    label: "Rules",
                    position: "left",
                    to: "/docs/rules/guides/intro",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "GitHub",
                    position: "right",
                },
            ],
            title: "eslint-plugin-yamllint",
        },
        prism: {
            additionalLanguages: [
                "bash",
                "json",
                "yaml",
                "typescript",
            ],
            darkTheme: prismThemes.dracula,
            theme: prismThemes.github,
        },
    } satisfies Preset.ThemeConfig,
    title: "eslint-plugin-yamllint",
    trailingSlash: false,
    url: siteOrigin,
} satisfies Config;

export default config;
