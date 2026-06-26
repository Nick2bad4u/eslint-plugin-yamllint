import { createEslintConfig } from "remark-config-nick2bad4u/eslint";

/**
 * @type {import("remark-config-nick2bad4u").RemarkConfig}
 */
const remarkConfig = createEslintConfig({
    docHeadings: {
        include: "docs/rules/*.md",
        requireRuleCatalogId: true,
        ruleNamespaceAliases: ["yamllint"],
    },
});

export default remarkConfig;
