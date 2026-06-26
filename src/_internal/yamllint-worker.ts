import * as path from "node:path";
import { isMainThread, parentPort } from "node:worker_threads";
import { isDefined } from "ts-extras";
import {
    linter,
    loadYamlLintConfig,
    YamlLintConfig,
} from "yamllint-js/internal";

import type {
    SerializableYamllintMessage,
    SerializableYamllintResult,
    YamllintWorkerRequest,
    YamllintWorkerResponse,
} from "./yamllint-worker-types.js";

const DONE_STATE = 1 as const;

const loadConfig = async (
    request: YamllintWorkerRequest
): Promise<YamlLintConfig> => {
    const cwd = request.options.cwd ?? process.cwd();
    if (isDefined(request.options.configFile)) {
        return YamlLintConfig.init({
            file: path.resolve(cwd, request.options.configFile),
        });
    }
    return loadYamlLintConfig({
        startDir: path.dirname(path.resolve(cwd, request.options.codeFilename)),
        stopDir: cwd,
    });
};

const runYamllint = async (
    request: YamllintWorkerRequest
): Promise<SerializableYamllintResult> => {
    const config = await loadConfig(request);
    const messages: SerializableYamllintMessage[] = [];
    for await (const problem of linter(
        request.options.code,
        config,
        request.options.codeFilename
    )) {
        if (request.options.noWarnings === true && problem.level === "warning")
            continue;
        messages.push({
            column: problem.column,
            level: problem.level,
            line: problem.line,
            message: problem.desc,
            ...(isDefined(problem.rule) && { rule: problem.rule }),
        });
    }
    return { messages };
};

const notifyCompletion = (
    request: YamllintWorkerRequest,
    response: YamllintWorkerResponse
): void => {
    // eslint-disable-next-line unicorn/require-post-message-target-origin -- MessagePort from node:worker_threads has no browser targetOrigin parameter.
    request.port.postMessage(response);
    request.port.close();
    const signal = new Int32Array(request.signalBuffer);
    Atomics.store(signal, 0, DONE_STATE);
    Atomics.notify(signal, 0);
};

const handleRequest = async (request: YamllintWorkerRequest): Promise<void> => {
    try {
        notifyCompletion(request, {
            ok: true,
            result: await runYamllint(request),
        });
    } catch (error: unknown) {
        // eslint-disable-next-line canonical/no-use-extend-native -- unicorn/prefer-error-is-error requires the native Error.isError guard.
        const normalizedError = Error.isError(error)
            ? {
                  message: error.message,
                  name: error.name,
                  ...(isDefined(error.stack) && { stack: error.stack }),
              }
            : {
                  message: `Unknown Yamllint worker failure: ${String(error)}`,
                  name: "YamllintWorkerError",
              };
        notifyCompletion(request, { error: normalizedError, ok: false });
    }
};

if (!isMainThread) {
    const onMessage = (request: YamllintWorkerRequest): void => {
        void handleRequest(request);
    };
    const removeOnExit = (): void => {
        parentPort?.off("message", onMessage);
    };
    parentPort?.on("message", onMessage);
    process.once("exit", removeOnExit);
}
