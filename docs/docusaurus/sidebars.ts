import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars = {
    docs: [
        "index",
        {
            items: ["developer/api/index"],
            label: "Developer",
            type: "category",
        },
    ],
} satisfies SidebarsConfig;

export default sidebars;
