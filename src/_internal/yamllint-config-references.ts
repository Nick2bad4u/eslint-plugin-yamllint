import type { ArrayValues } from "type-fest";

import { objectHasOwn } from "ts-extras";

/**
 * YamllintConfigNames yamllint config names contract.
 */
export const yamllintConfigNames = [
    "all",
    "configs",
    "configuration",
    "recommended",
    "yaml",
    "yamllintOnly",
] as const;

/**
 * YamllintConfigMetadata yamllint config metadata contract.
 */
export type YamllintConfigMetadata = Readonly<{
    icon: string;
    presetName: `yamllint:${YamllintConfigName}`;
    readmeOrder: number;
}>;

/**
 * YamllintConfigName yamllint config name contract.
 */
export type YamllintConfigName = ArrayValues<typeof yamllintConfigNames>;

/**
 * YamllintConfigMetadataByName yamllint config metadata by name contract.
 */
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

/**
 * YamllintConfigNamesByReadmeOrder yamllint config names by readme order
 * contract.
 */
export const yamllintConfigNamesByReadmeOrder: readonly YamllintConfigName[] = [
    "recommended",
    "yamllintOnly",
    "configuration",
    "all",
];

/**
 * YamllintConfigReferenceToName yamllint config reference to name contract.
 */
export const yamllintConfigReferenceToName = {
    "yamllint.configs.all": "all",
    "yamllint.configs.configs": "configuration",
    "yamllint.configs.configuration": "configuration",
    "yamllint.configs.recommended": "recommended",
    "yamllint.configs.yaml": "yamllintOnly",
    "yamllint.configs.yamllintOnly": "yamllintOnly",
} as const;

/**
 * YamllintConfigReference yamllint config reference contract.
 */
export type YamllintConfigReference =
    keyof typeof yamllintConfigReferenceToName;

/**
 * IsYamllintConfigReference is yamllint config reference contract.
 */
export const isYamllintConfigReference = (
    value: string
): value is YamllintConfigReference =>
    objectHasOwn(yamllintConfigReferenceToName, value);
