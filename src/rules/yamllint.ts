import { isDefined } from "ts-extras";

import {
    createTypedRule,
    type RuleModuleWithDocs,
    toRuleListener,
} from "../_internal/typed-rule.js";
import { runYamllintSynchronously } from "../_internal/yamllint-runner.js";

type MessageIds = "yamllintConfigError" | "yamllintProblem";
type Options = [YamllintRuleOption?];
type ReportLocation = Readonly<{
    end: { column: number; line: number };
    start: { column: number; line: number };
}>;

type YamllintRuleOption = Readonly<{
    configFile?: string;
    noWarnings?: boolean;
    strict?: boolean;
    timeoutMs?: number;
}>;

const toEslintLoc = (
    message: Readonly<{
        column: number;
        endColumn?: number;
        endLine?: number;
        line: number;
    }>
): ReportLocation => ({
    end: {
        column: Math.max((message.endColumn ?? message.column + 1) - 1, 0),
        line: message.endLine ?? message.line,
    },
    start: {
        column: Math.max(message.column - 1, 0),
        line: message.line,
    },
});

/**
 * YamllintRule ESLint rule contract.
 */
/**
 * YamllintRule ESLint bridge rule contract.
 */
const yamllintRule: RuleModuleWithDocs<MessageIds, Options> = createTypedRule<
    MessageIds,
    Options
>({
    create: (context, [rawOptions = {}]) =>
        toRuleListener({
            Program() {
                const lintOptions = {
                    code: context.sourceCode.text,
                    codeFilename: context.physicalFilename,
                    cwd: context.cwd,
                    ...(isDefined(rawOptions.configFile) && {
                        configFile: rawOptions.configFile,
                    }),
                    ...(isDefined(rawOptions.noWarnings) && {
                        noWarnings: rawOptions.noWarnings,
                    }),
                    ...(isDefined(rawOptions.strict) && {
                        strict: rawOptions.strict,
                    }),
                    ...(isDefined(rawOptions.timeoutMs) && {
                        timeoutMs: rawOptions.timeoutMs,
                    }),
                };
                let lintResult: ReturnType<typeof runYamllintSynchronously>;
                try {
                    lintResult = runYamllintSynchronously(lintOptions);
                } catch (error: unknown) {
                    context.report({
                        data: {
                            message:
                                error instanceof Error
                                    ? error.message
                                    : String(error),
                        },
                        loc: {
                            end: { column: 0, line: 1 },
                            start: { column: 0, line: 1 },
                        },
                        messageId: "yamllintConfigError",
                        node: context.sourceCode.ast,
                    });
                    return;
                }
                for (const message of lintResult.messages) {
                    context.report({
                        data: {
                            rule: message.rule ?? "yamllint",
                            text: message.message,
                        },
                        loc: toEslintLoc(message),
                        messageId: "yamllintProblem",
                        node: context.sourceCode.ast,
                    });
                }
            },
        }),
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            configs: [
                "yamllint.configs.recommended",
                "yamllint.configs.yamllintOnly",
                "yamllint.configs.all",
            ],
            description:
                "require Yamllint diagnostics against YAML files from ESLint.",
            recommended: true,
            requiresTypeChecking: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-yamllint/docs/rules/yamllint",
        },
        messages: {
            yamllintConfigError: "Yamllint configuration error: {{message}}",
            yamllintProblem: "Yamllint ({{rule}}): {{text}}",
        },
        schema: [
            {
                additionalProperties: true,
                description:
                    "Options forwarded to the underlying bridge linter for this ESLint rule.",
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "yamllint",
});

export default yamllintRule;
