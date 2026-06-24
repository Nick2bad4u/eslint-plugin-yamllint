import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import type * as Preset from "@docusaurus/preset-classic";
import type { Config, PluginModule } from "@docusaurus/types";

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { themes as prismThemes } from "prism-react-renderer";

// eslint-disable-next-line n/no-process-env -- Docusaurus config reads documented environment variables during site builds.
const environmentVariables = process.env;
const baseUrl =
    environmentVariables["DOCUSAURUS_BASE_URL"] ?? "/eslint-plugin-yamllint/";
const enableExperimentalFaster =
    environmentVariables["DOCUSAURUS_ENABLE_EXPERIMENTAL"] === "true";

const organizationName = "Nick2bad4u";
const projectName = "eslint-plugin-yamllint";
const siteOrigin = "https://nick2bad4u.github.io";
const siteUrl = `${siteOrigin}${baseUrl}`;
const siteDescription =
    "Run Yamllint from ESLint, report YAML diagnostics in the same editor and CI stream, and enforce Yamllint config-file conventions alongside the rest of your lint stack.";
const projectTagline = "YAML diagnostics inside ESLint.";
const projectKeywords =
    "eslint, eslint-plugin, yamllint, yaml linting, configuration linting, flat config";
const socialCardImagePath = "img/logo.png";
const socialCardImage = new URL(socialCardImagePath, siteUrl);
const socialCardImageUrl = socialCardImage.href;
const modernEnhancementsClientModule = fileURLToPath(
    new URL("src/js/modern-enhancements.ts", import.meta.url)
);

const pwaThemeColor = "#059669";
const pwaTileColor = "#059669";
const pwaMaskIconColor = "#059669";
// eslint-disable-next-line unicorn/prefer-temporal -- The Docusaurus TypeScript target does not expose Temporal types yet.
const currentDate = new Date();
const currentYear = currentDate.getUTCFullYear();
const footerCopyright =
    `© ${currentYear} ` +
    '<a href="https://github.com/Nick2bad4u/" target="_blank" rel="noopener noreferrer">Nick2bad4u</a> Built with ' +
    '<a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer">Docusaurus</a>.';

const legacyPostBuildHeadAttributeFlagKey = [
    "remove",
    "Le",
    "gacyPostBuildHeadAttribute",
].join("");

const requireFromDocsWorkspace = createRequire(import.meta.url);

const resolveOptionalModule = (moduleSpecifier: string): string | undefined => {
    try {
        return requireFromDocsWorkspace.resolve(moduleSpecifier);
    } catch {
        return undefined;
    }
};

const isRecordLike = (
    candidate: unknown
): candidate is Readonly<Record<string, unknown>> =>
    typeof candidate === "object" && candidate !== null;

const vscodeLanguageServerTypesEsmEntry = resolveOptionalModule(
    "vscode-languageserver-types/lib/esm/main.js"
);

const suppressKnownWebpackWarningsPlugin: PluginModule = () => ({
    configureWebpack: () => ({
        ignoreWarnings: [
            (warning: unknown) => {
                const warningMessage =
                    isRecordLike(warning) &&
                    typeof warning["message"] === "string"
                        ? warning["message"]
                        : undefined;

                return (
                    typeof warningMessage === "string" &&
                    warningMessage.includes(
                        "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
                    )
                );
            },
        ],
        resolve: {
            alias:
                vscodeLanguageServerTypesEsmEntry === undefined
                    ? {}
                    : {
                          "vscode-languageserver-types$":
                              vscodeLanguageServerTypesEsmEntry,
                          "vscode-languageserver-types/lib/umd/main.js$":
                              vscodeLanguageServerTypesEsmEntry,
                      },
        },
    }),
    name: "suppress-known-webpack-warnings",
});

const futureConfig = {
    ...(enableExperimentalFaster && {
        faster: {
            mdxCrossCompilerCache: true,
            rspackBundler: true,
            rspackPersistentCache: true,
            ssgWorkerThreads: true,
        },
    }),
    v4: {
        fasterByDefault: false,
        [legacyPostBuildHeadAttributeFlagKey]: true,
        mdx1CompatDisabledByDefault: true,
        removeLegacyPostBuildHeadAttribute: true,
        siteStorageNamespacing: true,
        useCssCascadeLayers: false,
    },
} satisfies Config["future"];

const config = {
    baseUrl,
    baseUrlIssueBanner: true,
    clientModules: [modernEnhancementsClientModule],
    deploymentBranch: "gh-pages",
    favicon: "img/favicon.ico",
    future: futureConfig,
    headTags: [
        {
            attributes: { href: siteOrigin, rel: "preconnect" },
            tagName: "link",
        },
        {
            attributes: { href: "https://github.com", rel: "preconnect" },
            tagName: "link",
        },
        {
            attributes: { type: "application/ld+json" },
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                description: siteDescription,
                image: socialCardImageUrl,
                name: `${projectName} Documentation`,
                publisher: {
                    "@type": "Person",
                    name: "Nick2bad4u",
                    url: "https://github.com/Nick2bad4u",
                },
                url: siteUrl,
            }),
            tagName: "script",
        },
    ],
    i18n: { defaultLocale: "en", locales: ["en"] },
    markdown: {
        anchors: { maintainCase: true },
        emoji: true,
        format: "detect",
        hooks: {
            onBrokenMarkdownImages: "warn",
            onBrokenMarkdownLinks: "warn",
        },
        mermaid: true,
    },
    noIndex: false,
    onBrokenAnchors: "warn",
    onBrokenLinks: "warn",
    onDuplicateRoutes: "warn",
    organizationName,
    plugins: [
        suppressKnownWebpackWarningsPlugin,
        "docusaurus-plugin-image-zoom",
        [
            "@docusaurus/plugin-pwa",
            {
                // eslint-disable-next-line n/no-process-env -- Docusaurus PWA debug validation requires the documented process.env comparison form.
                debug: process.env["DOCUSAURUS_PWA_DEBUG"] === "true",
                offlineModeActivationStrategies: [
                    "appInstalled",
                    "standalone",
                    "queryString",
                ],
                pwaHead: [
                    {
                        href: `${baseUrl}manifest.json`,
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        content: pwaThemeColor,
                        name: "theme-color",
                        tagName: "meta",
                    },
                    {
                        content: "yes",
                        name: "apple-mobile-web-app-capable",
                        tagName: "meta",
                    },
                    {
                        content: "default",
                        name: "apple-mobile-web-app-status-bar-style",
                        tagName: "meta",
                    },
                    {
                        href: `${baseUrl}img/logo_192x192.png`,
                        rel: "apple-touch-icon",
                        tagName: "link",
                    },
                    {
                        color: pwaMaskIconColor,
                        href: `${baseUrl}img/logo.svg`,
                        rel: "mask-icon",
                        tagName: "link",
                    },
                    {
                        content: `${baseUrl}img/logo_192x192.png`,
                        name: "msapplication-TileImage",
                        tagName: "meta",
                    },
                    {
                        content: pwaTileColor,
                        name: "msapplication-TileColor",
                        tagName: "meta",
                    },
                ],
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/`,
                id: "rules",
                path: "../rules",
                routeBasePath: "docs/rules",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                sidebarPath: "./sidebars.rules.ts",
            } satisfies DocsPluginOptions,
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: false,
                debug:
                    environmentVariables["DOCUSAURUS_PRESET_CLASSIC_DEBUG"] ===
                    "true",
                docs: {
                    breadcrumbs: true,
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    includeCurrentVersion: true,
                    onInlineTags: "ignore",
                    path: "site-docs",
                    routeBasePath: "docs",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    sidebarCollapsed: true,
                    sidebarCollapsible: true,
                    sidebarPath: "./sidebars.ts",
                },
                googleTagManager: { containerId: "GTM-T8J6HPLF" },
                gtag: { trackingID: "G-18DR1S6R1T" },
                pages: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    exclude: [
                        "**/*.d.ts",
                        "**/*.d.tsx",
                        "**/__tests__/**",
                        "**/*.test.{js,jsx,ts,tsx}",
                        "**/*.spec.{js,jsx,ts,tsx}",
                    ],
                    include: ["**/*.{js,jsx,ts,tsx,md,mdx}"],
                    mdxPageComponent: "@theme/MDXPage",
                    path: "src/pages",
                    routeBasePath: "/",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                },
                sitemap: {
                    filename: "sitemap.xml",
                    ignorePatterns: ["/tests/**"],
                    lastmod: "datetime",
                },
                svgr: {
                    svgrConfig: {
                        dimensions: false,
                        expandProps: "start",
                        icon: true,
                        memo: true,
                        native: false,
                        prettier: true,
                        prettierConfig: "../../.prettierrc",
                        replaceAttrValues: {
                            "#000": "currentColor",
                            "#000000": "currentColor",
                        },
                        svgo: true,
                        svgoConfig: {
                            plugins: [{ active: false, name: "removeViewBox" }],
                        },
                        svgProps: { focusable: "false", role: "img" },
                        titleProp: true,
                        typescript: true,
                    },
                },
                theme: { customCss: "./src/css/custom.css" },
            } satisfies Preset.Options,
        ],
    ],
    projectName,
    staticDirectories: ["static"],
    storage: { namespace: true, type: "localStorage" },
    tagline: projectTagline,
    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        footer: {
            copyright: footerCopyright,
            links: [
                {
                    items: [
                        { label: "Overview", to: "/docs/rules/overview" },
                        {
                            label: "Getting Started",
                            to: "/docs/rules/getting-started",
                        },
                        { label: "Presets", to: "/docs/rules/presets" },
                    ],
                    title: "Explore",
                },
                {
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}/releases`,
                            label: "Releases",
                        },
                        {
                            href: `https://nick2bad4u.github.io/${projectName}/eslint-inspector/`,
                            label: "ESLint Inspector",
                        },
                        {
                            href: `https://www.npmjs.com/package/${projectName}`,
                            label: "NPM",
                        },
                    ],
                    title: "Project",
                },
                {
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "GitHub Repository",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/issues`,
                            label: "Report Issues",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/security`,
                            label: "Security Policy",
                        },
                    ],
                    title: "Support",
                },
            ],
            logo: {
                alt: `${projectName} logo`,
                height: 60,
                href: `https://github.com/${organizationName}/${projectName}`,
                src: "img/logo.svg",
                width: 60,
            },
            style: "dark",
        },
        image: socialCardImagePath,
        metadata: [
            { content: projectKeywords, name: "keywords" },
            { content: "summary_large_image", name: "twitter:card" },
            { content: projectName, property: "og:site_name" },
        ],
        navbar: {
            hideOnScroll: true,
            items: [
                {
                    activeBaseRegex: "^/docs/rules/overview/?$",
                    items: [
                        { label: "Overview", to: "/docs/rules/overview" },
                        {
                            label: "Getting Started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            label: "Bridge Guide",
                            to: "/docs/rules/guides/yamllint-bridge",
                        },
                        {
                            label: "Config Authoring",
                            to: "/docs/rules/guides/config-authoring",
                        },
                    ],
                    label: "Docs",
                    position: "left",
                    to: "/docs/rules/overview",
                    type: "dropdown",
                },
                {
                    activeBaseRegex: "^/docs/rules(?:/(?!presets(?:/|$)).*)?$",
                    items: [
                        {
                            label: "Yamllint Bridge",
                            to: "/docs/rules/yamllint",
                        },
                        { label: "FAQ", to: "/docs/rules/guides/faq" },
                    ],
                    label: "Rules",
                    position: "left",
                    to: "/docs/rules",
                    type: "dropdown",
                },
                {
                    activeBaseRegex: "^/docs/rules/presets(?:/.*)?$",
                    items: [
                        {
                            label: "Preset Reference",
                            to: "/docs/rules/presets",
                        },
                        {
                            label: "Recommended",
                            to: "/docs/rules/presets/recommended",
                        },
                        {
                            label: "Yamllint Only",
                            to: "/docs/rules/presets/yamllint-only",
                        },
                        {
                            label: "Configuration",
                            to: "/docs/rules/presets/configuration",
                        },
                        { label: "All", to: "/docs/rules/presets/all" },
                    ],
                    label: "Presets",
                    position: "left",
                    to: "/docs/rules/presets",
                    type: "dropdown",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "GitHub",
                        },
                        {
                            href: `https://www.npmjs.com/package/${projectName}`,
                            label: "NPM",
                        },
                        {
                            href: `https://github.com/${organizationName}/${projectName}/releases`,
                            label: "Releases",
                        },
                    ],
                    label: "GitHub",
                    position: "right",
                    type: "dropdown",
                },
                {
                    items: [
                        { label: "API Reference", to: "/docs/developer/api" },
                    ],
                    label: "Dev",
                    position: "right",
                    to: "/docs/developer/api",
                    type: "dropdown",
                },
            ],
            logo: {
                alt: `${projectName} logo`,
                height: 48,
                href: baseUrl,
                src: "img/logo.svg",
                width: 48,
            },
            style: "dark",
            title: projectName,
        },
        prism: {
            additionalLanguages: [
                "bash",
                "json",
                "yaml",
                "typescript",
            ],
            darkTheme: prismThemes.dracula,
            defaultLanguage: "typescript",
            theme: prismThemes.github,
        },
        tableOfContents: { maxHeadingLevel: 4, minHeadingLevel: 2 },
        zoom: {
            background: {
                dark: "rgb(50, 50, 50)",
                light: "rgb(255, 255, 255)",
            },
            config: {},
            selector: ".markdown > img",
        },
    } satisfies Preset.ThemeConfig,
    themes: [
        "@docusaurus/theme-mermaid",
        [
            "@easyops-cn/docusaurus-search-local",
            {
                docsDir: "docs",
                docsRouteBasePath: "docs",
                explicitSearchResultPath: false,
                forceIgnoreNoIndex: true,
                fuzzyMatchingDistance: 1,
                hashed: true,
                hideSearchBarWithNoSearchContext: false,
                highlightSearchTermsOnTargetPage: true,
                indexBlog: false,
                indexDocs: true,
                indexPages: false,
                language: ["en"],
                removeDefaultStemmer: true,
                removeDefaultStopWordFilter: false,
                searchBarPosition: "left",
                searchBarShortcut: true,
                searchBarShortcutHint: true,
                searchBarShortcutKeymap: "ctrl+k",
                searchResultContextMaxLength: 96,
                searchResultLimits: 8,
                useAllContextsWithNoSearchContext: false,
            },
        ],
    ],
    title: projectName,
    titleDelimiter: "|",
    trailingSlash: true,
    url: siteOrigin,
} satisfies Config;

export default config;
