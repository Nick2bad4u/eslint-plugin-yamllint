import type { Except } from "type-fest";

import { isDefined, setHas } from "ts-extras";

import type { YamllintConfigReference } from "./yamllint-config-references.js";

import { createRuleDocsUrl } from "./rule-docs-url.js";
import {
    createTypedRule,
    type RuleModuleWithDocs,
    toRuleListener,
} from "./typed-rule.js";

type ConfigRuleDefinition = Readonly<{
    check: (sourceText: string, fileName: string) => string | undefined;
    configs: readonly YamllintConfigReference[];
    description: string;
    name: string;
    recommended: boolean;
}>;
type MessageIds = "configProblem";

type Options = [];

const yamlTopLevelPropertyPattern = /^(?<propertyName>[A-Za-z][\w\-]*)\s*:/gmv;
const objectPropertyPrefixes = new Set<string>([
    ",",
    "{",
    "}",
]);
const whitespaceCharacters = new Set<string>([
    "\n",
    "\r",
    "\t",
    " ",
]);

const isAsciiLetter = (character: string): boolean =>
    (character >= "A" && character <= "Z") ||
    (character >= "a" && character <= "z");

const isAsciiDigit = (character: string): boolean =>
    character >= "0" && character <= "9";

const isIdentifierCharacter = (character: string): boolean =>
    isAsciiLetter(character) ||
    isAsciiDigit(character) ||
    character === "-" ||
    character === "_";

const isWhitespace = (character: string): boolean =>
    setHas(whitespaceCharacters, character);

const isObjectPropertyPrefix = (character: string | undefined): boolean =>
    !isDefined(character) || setHas(objectPropertyPrefixes, character);

const hasPropertyIn = (
    properties: readonly string[],
    propertyName: string
): boolean => setHas(new Set(properties), propertyName);

const hasAllowedProperty = (
    allowedProperties: ReadonlySet<string>,
    propertyName: string
): boolean => setHas(allowedProperties, propertyName);

const collectJsObjectPropertyMatches = (sourceText: string): string[] => {
    const properties: string[] = [];
    let searchFrom = 0;
    let colonIndex = sourceText.indexOf(":", searchFrom);
    while (colonIndex !== -1) {
        let propertyEnd = colonIndex;
        while (
            propertyEnd > 0 &&
            isWhitespace(sourceText.charAt(propertyEnd - 1))
        ) {
            propertyEnd -= 1;
        }
        let propertyStart = propertyEnd;
        while (
            propertyStart > 0 &&
            isIdentifierCharacter(sourceText.charAt(propertyStart - 1))
        ) {
            propertyStart -= 1;
        }
        const propertyName = sourceText.slice(propertyStart, propertyEnd);
        const prefix = sourceText.slice(0, propertyStart).trimEnd().at(-1);
        if (
            propertyName.length > 0 &&
            isAsciiLetter(propertyName.charAt(0)) &&
            isObjectPropertyPrefix(prefix)
        ) {
            properties.push(propertyName);
        }
        searchFrom = colonIndex + 1;
        colonIndex = sourceText.indexOf(":", searchFrom);
    }
    return properties;
};

const collectPropertyMatches = (
    sourceText: string,
    syntax: "js" | "yaml"
): string[] => {
    if (syntax === "js") return collectJsObjectPropertyMatches(sourceText);
    const matches = sourceText.matchAll(yamlTopLevelPropertyPattern);
    const properties: string[] = [];
    for (const match of matches) {
        const propertyName = match.groups?.["propertyName"];
        if (typeof propertyName === "string") properties.push(propertyName);
    }
    return properties;
};

/**
 * HasConfigProperty has config property contract.
 */
export const hasConfigProperty = (
    sourceText: string,
    propertyName: string
): boolean =>
    hasPropertyIn(collectPropertyMatches(sourceText, "yaml"), propertyName) ||
    hasPropertyIn(collectPropertyMatches(sourceText, "js"), propertyName) ||
    sourceText.includes(`"${propertyName}"`);

/**
 * CreateConfigTextRule create config text rule contract.
 */
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

/**
 * CreateRequirePropertyRule create require property rule contract.
 */
export const createRequirePropertyRule = (
    definition: Except<ConfigRuleDefinition, "check"> &
        Readonly<{ propertyName: string }>
): RuleModuleWithDocs<MessageIds, Options> =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) => {
            if (hasConfigProperty(sourceText, definition.propertyName)) {
                return undefined;
            }
            return `Expected this config to define '${definition.propertyName}'.`;
        },
    });

/**
 * CreateFilenameRule create filename rule contract.
 */
export const createFilenameRule = (
    definition: Except<ConfigRuleDefinition, "check"> &
        Readonly<{ allowedPattern: RegExp }>
): RuleModuleWithDocs<MessageIds, Options> =>
    createConfigTextRule({
        ...definition,
        check: (_sourceText, fileName) =>
            definition.allowedPattern.test(fileName.replaceAll("\\", "/"))
                ? undefined
                : "Expected this config file to use a supported filename for this tool.",
    });

/**
 * CreateUnknownPropertiesRule create unknown properties rule contract.
 */
export const createUnknownPropertiesRule = (
    definition: Except<ConfigRuleDefinition, "check"> &
        Readonly<{ allowedProperties: readonly string[] }>
): RuleModuleWithDocs<MessageIds, Options> =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) => {
            const properties = collectPropertyMatches(sourceText, "yaml");
            const allowedProperties = new Set<string>(
                definition.allowedProperties
            );
            const unknown = properties.find(
                (propertyName) =>
                    !hasAllowedProperty(allowedProperties, propertyName)
            );
            if (typeof unknown !== "string") return undefined;
            return `Unexpected top-level config property '${unknown}'.`;
        },
    });

/**
 * CreateNoEmptyStringRule create no empty string rule contract.
 */
export const createNoEmptyStringRule = (
    definition: Except<ConfigRuleDefinition, "check">
): RuleModuleWithDocs<MessageIds, Options> =>
    createConfigTextRule({
        ...definition,
        check: (sourceText) =>
            /["']{2}|-\s*["']{2}/v.test(sourceText)
                ? "Expected config string values and patterns to be non-empty."
                : undefined,
    });
