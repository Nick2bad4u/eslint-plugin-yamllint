import type { TSESLint } from "@typescript-eslint/utils";
import type { Except, UnknownArray, UnknownRecord } from "type-fest";

import { isDefined, objectEntries } from "ts-extras";

import type { YamllintConfigReference } from "./yamllint-config-references.js";

import { createRuleDocsUrl } from "./rule-docs-url.js";

export type GenericRuleContext<
    MessageIds extends string,
    Options extends Readonly<UnknownArray>,
> = Readonly<TSESLint.RuleContext<MessageIds, Options>>;

export type GenericRuleListener = Readonly<
    Record<string, (node: unknown) => void>
>;

export type RuleDefinitionWithDocs<
    MessageIds extends string,
    Options extends Readonly<UnknownArray>,
> = Except<RuleModuleWithDocs<MessageIds, Options>, "create" | "meta"> & {
    create: (
        context: GenericRuleContext<MessageIds, Options>,
        options: Options
    ) => TSESLint.RuleListener;
    meta: RuleModuleWithDocs<MessageIds, Options>["meta"];
};

export type RuleModuleWithDocs<
    MessageIds extends string,
    Options extends Readonly<UnknownArray>,
> = TSESLint.RuleModule<MessageIds, Options> & {
    meta: TSESLint.RuleMetaData<MessageIds, YamllintRuleDocs, Options> & {
        deprecated: boolean;
        docs: YamllintRuleDocs;
    };
    name: string;
};

export type YamllintRuleDocs = Readonly<{
    configs: readonly YamllintConfigReference[] | YamllintConfigReference;
    description: string;
    frozen?: boolean;
    recommended: boolean;
    requiresTypeChecking: boolean;
    url: string;
}>;

const isReadonlyRecord = (value: unknown): value is Readonly<UnknownRecord> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const mergeOptionValue = (
    defaultValue: unknown,
    configuredValue: unknown
): unknown => {
    if (!isDefined(configuredValue)) return defaultValue;

    if (isReadonlyRecord(defaultValue) && isReadonlyRecord(configuredValue)) {
        const mergedValue: UnknownRecord = { ...defaultValue };
        for (const [propertyName, propertyValue] of objectEntries(
            configuredValue
        )) {
            mergedValue[propertyName] = mergeOptionValue(
                defaultValue[propertyName],
                propertyValue
            );
        }
        return mergedValue;
    }
    return configuredValue;
};

const mergeDefaultOptions = <Options extends Readonly<UnknownArray>>(
    defaultOptions: Options,
    configuredOptions: Readonly<UnknownArray>
): Options => {
    const mergedOptions: unknown[] = [];
    const maxLength = Math.max(defaultOptions.length, configuredOptions.length);
    for (let index = 0; index < maxLength; index += 1) {
        mergedOptions.push(
            mergeOptionValue(defaultOptions[index], configuredOptions[index])
        );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint exposes options as unknown arrays; this restores the generic rule option tuple after merging defaults.
    return mergedOptions as unknown as Options;
};

const getMergedRuleOptions = <Options extends Readonly<UnknownArray>>(
    ruleDefinition: Readonly<{ meta: { defaultOptions?: Options } }>,
    configuredOptions: Options
): Options =>
    isDefined(ruleDefinition.meta.defaultOptions)
        ? mergeDefaultOptions(
              ruleDefinition.meta.defaultOptions,
              configuredOptions
          )
        : configuredOptions;

export const createTypedRule = <
    MessageIds extends string,
    Options extends Readonly<UnknownArray>,
>(
    ruleDefinition: Readonly<RuleDefinitionWithDocs<MessageIds, Options>>
): RuleModuleWithDocs<MessageIds, Options> => {
    const canonicalDocsUrl = createRuleDocsUrl(ruleDefinition.name);
    if (ruleDefinition.meta.docs.url !== canonicalDocsUrl) {
        throw new TypeError(
            `Rule '${ruleDefinition.name}' must declare docs.url as '${canonicalDocsUrl}'.`
        );
    }
    return {
        ...ruleDefinition,
        create: (context) =>
            ruleDefinition.create(
                context,
                getMergedRuleOptions(ruleDefinition, context.options)
            ),
        meta: { ...ruleDefinition.meta, docs: ruleDefinition.meta.docs },
    };
};

export const toRuleListener = (
    listener: GenericRuleListener
): TSESLint.RuleListener => listener;
