import type { RuleModuleWithDocs } from "./typed-rule.js";
import type { YamllintConfigReference } from "./yamllint-config-references.js";

import { createRuleDocsUrl } from "./rule-docs-url.js";
import { createTypedRule, toRuleListener } from "./typed-rule.js";

type ConfigRuleDefinition = Readonly<{
    check: (sourceText: string, fileName: string) => string | undefined;
    configs: readonly YamllintConfigReference[];
    description: string;
    name: string;
    recommended: boolean;
}>;
type MessageIds = "configProblem";

type Options = [];

const yamlTopLevelPropertyPattern = /^([A-Za-z][\w-]*)\s*:/gmu;
const jsObjectPropertyPattern = /(?:^|[,{])\s*([A-Za-z][\w-]*)\s*:/gmu;

const collectPropertyMatches = (
    sourceText: string,
    syntax: "js" | "yaml"
): string[] => {
    const matches = sourceText.matchAll(
        syntax === "yaml"
            ? yamlTopLevelPropertyPattern
            : jsObjectPropertyPattern
    );
    const properties: string[] = [];
    for (const match of matches) {
        const propertyName = match[1];
        if (typeof propertyName === "string") properties.push(propertyName);
    }
    return properties;
};

export const hasConfigProperty = (
    sourceText: string,
    propertyName: string
): boolean =>
    collectPropertyMatches(sourceText, "yaml").includes(propertyName) ||
    collectPropertyMatches(sourceText, "js").includes(propertyName) ||
    sourceText.includes(`"${propertyName}"`);

export function createConfigTextRule(
    definition: ConfigRuleDefinition
): RuleModuleWithDocs<MessageIds, Options> {
    return createTypedRule<MessageIds, Options>({
        create: (context) =>
            toRuleListener({
                Program() {
                    const message = definition.check(
                        context.sourceCode.text,
                        context.physicalFilename
                    );
                    if (typeof message !== "string") return;
                    context.report({
                        data: { message },
                        loc: {
                            end: { column: 0, line: 1 },
                            start: { column: 0, line: 1 },
                        },
                        messageId: "configProblem",
                        node: context.sourceCode.ast,
                    });
                },
            }),
        meta: {
            defaultOptions: [],
            deprecated: false,
            docs: {
                configs: definition.configs,
                description: definition.description,
                recommended: definition.recommended,
                requiresTypeChecking: false,
                url: createRuleDocsUrl(definition.name),
            },
            messages: { configProblem: "Yamllint config: {{message}}" },
            schema: [],
            type: "problem",
        },
        name: definition.name,
    });
}

export const createRequirePropertyRule = (
    definition: Omit<ConfigRuleDefinition, "check"> &
        Readonly<{ propertyName: string }>
): RuleModuleWithDocs<MessageIds, Options> =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) =>
            hasConfigProperty(sourceText, definition.propertyName)
                ? undefined
                : `Expected this config to define '${definition.propertyName}'.`,
    });

export const createFilenameRule = (
    definition: Omit<ConfigRuleDefinition, "check"> &
        Readonly<{ allowedPattern: RegExp }>
): RuleModuleWithDocs<MessageIds, Options> =>
    createConfigTextRule({
        ...definition,
        check: (_sourceText, fileName) =>
            definition.allowedPattern.test(fileName.replaceAll("\\", "/"))
                ? undefined
                : "Expected this config file to use a supported filename for this tool.",
    });

export const createUnknownPropertiesRule = (
    definition: Omit<ConfigRuleDefinition, "check"> &
        Readonly<{ allowedProperties: readonly string[] }>
): RuleModuleWithDocs<MessageIds, Options> =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) => {
            const known = new Set(definition.allowedProperties);
            const properties = collectPropertyMatches(sourceText, "yaml");
            const unknown = properties.find(
                (propertyName) => !known.has(propertyName)
            );
            return typeof unknown === "string"
                ? `Unexpected top-level config property '${unknown}'.`
                : undefined;
        },
    });

export const createNoEmptyStringRule = (
    definition: Omit<ConfigRuleDefinition, "check">
): RuleModuleWithDocs<MessageIds, Options> =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) =>
            /["']{2}|-\s*["']{2}/v.test(sourceText)
                ? "Expected config string values and patterns to be non-empty."
                : undefined,
    });
