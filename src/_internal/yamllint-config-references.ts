import type { ArrayValues } from "type-fest";

import { objectHasOwn } from "ts-extras";

export const yamllintConfigNames = [
    "all",
    "configs",
    "configuration",
    "recommended",
    "yaml",
    "yamllintOnly",
] as const;

export type YamllintConfigMetadata = Readonly<{
    icon: string;
    presetName: `yamllint:${YamllintConfigName}`;
    readmeOrder: number;
}>;

export type YamllintConfigName = ArrayValues<typeof yamllintConfigNames>;

export const yamllintConfigMetadataByName: Readonly<
    Record<YamllintConfigName, YamllintConfigMetadata>
> = {
    all: { icon: "🟣", presetName: "yamllint:all", readmeOrder: 4 },
    configs: { icon: "🔧", presetName: "yamllint:configs", readmeOrder: 6 },
    configuration: {
        icon: "🔧",
        presetName: "yamllint:configuration",
        readmeOrder: 3,
    },
    recommended: {
        icon: "🟡",
        presetName: "yamllint:recommended",
        readmeOrder: 1,
    },
    yaml: { icon: "🧪", presetName: "yamllint:yaml", readmeOrder: 5 },
    yamllintOnly: {
        icon: "🧪",
        presetName: "yamllint:yamllintOnly",
        readmeOrder: 2,
    },
};

export const yamllintConfigNamesByReadmeOrder: readonly YamllintConfigName[] = [
    "recommended",
    "yamllintOnly",
    "configuration",
    "all",
];

export const yamllintConfigReferenceToName = {
    "yamllint.configs.all": "all",
    "yamllint.configs.configs": "configuration",
    "yamllint.configs.configuration": "configuration",
    "yamllint.configs.recommended": "recommended",
    "yamllint.configs.yaml": "yamllintOnly",
    "yamllint.configs.yamllintOnly": "yamllintOnly",
} as const;

export type YamllintConfigReference =
    keyof typeof yamllintConfigReferenceToName;

export const isYamllintConfigReference = (
    value: string
): value is YamllintConfigReference =>
    objectHasOwn(yamllintConfigReferenceToName, value);
