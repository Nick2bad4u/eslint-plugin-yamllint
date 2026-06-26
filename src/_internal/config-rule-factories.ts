import type { Except } from "type-fest";

import * as fs from "node:fs";
import { createRequire } from "node:module";
import * as path from "node:path";
import { isDefined, setHas, stringSplit } from "ts-extras";

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
type ExtendedConfigPropertyState = Readonly<{
    depth: number;
    visitedFiles: ReadonlySet<string>;
}>;
type MessageIds = "configProblem";

type Options = [];

const requireFromThisModule = createRequire(import.meta.url);
const maxExtendedConfigDepth = 10;
const builtinYamllintConfigNames = new Set<string>(["default", "relaxed"]);
const yamlTopLevelPropertyPattern = /^[A-Za-z][\w\-]*(?=\s*:)/gmv;
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

const isFile = (filePath: string): boolean => {
    try {
        // eslint-disable-next-line n/no-sync, security/detect-non-literal-fs-filename -- ESLint rule visitors are synchronous.
        return fs.statSync(filePath).isFile();
    } catch {
        return false;
    }
};

const getYamllintPackageRoot = (): string | undefined => {
    try {
        return path.dirname(
            requireFromThisModule.resolve("yamllint-js/package.json")
        );
    } catch {
        return undefined;
    }
};

const getBuiltinYamllintConfigPath = (
    configName: string
): string | undefined => {
    if (!setHas(builtinYamllintConfigNames, configName)) return undefined;
    const packageRoot = getYamllintPackageRoot();
    if (!isDefined(packageRoot)) return undefined;
    const configPath = path.join(
        packageRoot,
        "dist",
        "conf",
        `${configName}.yaml`
    );
    return isFile(configPath) ? configPath : undefined;
};

const getExistingRealPath = (filePath: string): string | undefined => {
    try {
        // eslint-disable-next-line n/no-sync, security/detect-non-literal-fs-filename -- ESLint rule visitors are synchronous.
        return fs.realpathSync(filePath);
    } catch {
        return undefined;
    }
};

const getSourceDirectory = (fileName: string): string =>
    path.dirname(path.resolve(fileName));

const splitPackageRequest = (
    request: string
):
    | Readonly<{ packageName: string; subpathSegments: readonly string[] }>
    | undefined => {
    const segments = stringSplit(request.replaceAll("\\", "/"), "/").filter(
        (segment) => segment.length > 0
    );
    const [firstSegment, secondSegment] = segments;
    if (!isDefined(firstSegment)) return undefined;
    if (firstSegment.startsWith("@")) {
        if (!isDefined(secondSegment)) return undefined;
        return {
            packageName: `${firstSegment}/${secondSegment}`,
            subpathSegments: segments.slice(2),
        };
    }
    return {
        packageName: firstSegment,
        subpathSegments: segments.slice(1),
    };
};

const resolveNodeModuleFile = (
    request: string,
    startDirectory: string
): string | undefined => {
    const packageRequest = splitPackageRequest(request);
    if (!isDefined(packageRequest)) return undefined;

    let currentDirectory = path.resolve(startDirectory);
    while (true) {
        const candidate = path.join(
            currentDirectory,
            "node_modules",
            packageRequest.packageName,
            ...packageRequest.subpathSegments
        );
        if (isFile(candidate)) return candidate;

        const parentDirectory = path.dirname(currentDirectory);
        if (parentDirectory === currentDirectory) return undefined;
        currentDirectory = parentDirectory;
    }
};

const resolveExtendedConfigPath = (
    extendedConfigName: string,
    sourceFileName: string
): string | undefined => {
    const builtinConfigPath = getBuiltinYamllintConfigPath(extendedConfigName);
    if (isDefined(builtinConfigPath)) return builtinConfigPath;

    const sourceDirectory = getSourceDirectory(sourceFileName);
    const candidates = [
        path.isAbsolute(extendedConfigName)
            ? extendedConfigName
            : path.resolve(sourceDirectory, extendedConfigName),
        path.resolve(process.cwd(), extendedConfigName),
    ];
    for (const candidate of candidates) {
        if (isFile(candidate)) return candidate;
    }

    return resolveNodeModuleFile(extendedConfigName, sourceDirectory);
};

const parseUnquotedConfigValue = (value: string): string | undefined => {
    const commentIndex = value.indexOf("#");
    const unquotedValue =
        commentIndex === -1 ? value : value.slice(0, commentIndex);
    const trimmedValue = unquotedValue.trim();
    return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const parseQuotedConfigValue = (value: string): string | undefined => {
    const quote = value.charAt(0);
    if (quote !== '"' && quote !== "'") return undefined;

    const closingQuoteIndex = value.indexOf(quote, 1);
    if (closingQuoteIndex === -1) return undefined;
    const quotedValue = value.slice(1, closingQuoteIndex).trim();
    return quotedValue.length > 0 ? quotedValue : undefined;
};

const parseYamlConfigScalar = (value: string): string | undefined => {
    const trimmedValue = value.trim();
    return (
        parseQuotedConfigValue(trimmedValue) ??
        parseUnquotedConfigValue(trimmedValue)
    );
};

const getYamlExtendedConfigName = (sourceText: string): string | undefined => {
    let lineStart = 0;
    while (lineStart < sourceText.length) {
        const lineEndIndex = sourceText.indexOf("\n", lineStart);
        const lineEnd = lineEndIndex === -1 ? sourceText.length : lineEndIndex;
        const line = sourceText.slice(lineStart, lineEnd).trimEnd();
        if (line.startsWith("extends")) {
            let propertyEnd = "extends".length;
            while (isWhitespace(line.charAt(propertyEnd))) propertyEnd += 1;
            if (line.charAt(propertyEnd) === ":") {
                return parseYamlConfigScalar(line.slice(propertyEnd + 1));
            }
        }
        lineStart = lineEnd + 1;
    }
    return undefined;
};

const getJsObjectPropertyStringValue = (
    sourceText: string,
    propertyName: string
): string | undefined => {
    let searchFrom = 0;
    let propertyIndex = sourceText.indexOf(propertyName, searchFrom);
    while (propertyIndex !== -1) {
        const prefix = sourceText.slice(0, propertyIndex).trimEnd().at(-1);
        let propertyEnd = propertyIndex + propertyName.length;
        while (isWhitespace(sourceText.charAt(propertyEnd))) propertyEnd += 1;
        if (
            isObjectPropertyPrefix(prefix) &&
            sourceText.charAt(propertyEnd) === ":"
        ) {
            const rawValue = sourceText.slice(propertyEnd + 1).trimStart();
            const value = parseQuotedConfigValue(rawValue);
            if (isDefined(value)) return value;
        }
        searchFrom = propertyIndex + propertyName.length;
        propertyIndex = sourceText.indexOf(propertyName, searchFrom);
    }
    return undefined;
};

const getExtendedConfigName = (sourceText: string): string | undefined =>
    getYamlExtendedConfigName(sourceText) ??
    getJsObjectPropertyStringValue(sourceText, "extends");

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
        const propertyName = match[0];
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

const hasExtendedConfigProperty = (
    sourceText: string,
    sourceFileName: string,
    propertyName: string,
    state: ExtendedConfigPropertyState
): boolean => {
    if (hasConfigProperty(sourceText, propertyName)) return true;
    if (state.depth >= maxExtendedConfigDepth) return false;

    const extendedConfigName = getExtendedConfigName(sourceText);
    if (!isDefined(extendedConfigName)) return false;

    const extendedConfigPath = resolveExtendedConfigPath(
        extendedConfigName,
        sourceFileName
    );
    if (!isDefined(extendedConfigPath)) return false;

    const realPath = getExistingRealPath(extendedConfigPath);
    if (!isDefined(realPath) || setHas(state.visitedFiles, realPath)) {
        return false;
    }

    let extendedConfigText: string;
    try {
        // eslint-disable-next-line n/no-sync, security/detect-non-literal-fs-filename -- ESLint rule visitors are synchronous.
        extendedConfigText = fs.readFileSync(realPath, "utf8");
    } catch {
        return false;
    }

    return hasExtendedConfigProperty(
        extendedConfigText,
        realPath,
        propertyName,
        {
            depth: state.depth + 1,
            visitedFiles: new Set([...state.visitedFiles, realPath]),
        }
    );
};

const hasConfigOrExtendedConfigProperty = (
    sourceText: string,
    sourceFileName: string,
    propertyName: string
): boolean =>
    hasExtendedConfigProperty(sourceText, sourceFileName, propertyName, {
        depth: 0,
        visitedFiles: new Set<string>(),
    });

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
        check: (sourceText, fileName) => {
            if (
                hasConfigOrExtendedConfigProperty(
                    sourceText,
                    fileName,
                    definition.propertyName
                )
            ) {
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
