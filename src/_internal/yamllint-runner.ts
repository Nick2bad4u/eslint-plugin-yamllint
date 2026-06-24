import type { UnknownRecord } from "type-fest";

import {
    MessageChannel,
    receiveMessageOnPort,
    Worker,
} from "node:worker_threads";
import { assertDefined, isDefined, keyIn } from "ts-extras";

import type {
    SerializableYamllintLintOptions,
    SerializableYamllintResult,
    YamllintWorkerResponse,
} from "./yamllint-worker-types.js";

const WAIT_TIMEOUT_IN_MILLISECONDS = 30_000 as const;
const WORKER_DONE_STATE = 1 as const;
const lintResultCache = new Map<string, SerializableYamllintResult>();
const workerState: { current: null | Worker } = { current: null };
const isUsesTypeScriptSourceWorker = import.meta.url.endsWith(".ts");
const workerModuleUrl = new URL(
    isUsesTypeScriptSourceWorker
        ? "./yamllint-worker.ts"
        : "./yamllint-worker.js",
    import.meta.url
);

const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const isWorkerResponse = (value: unknown): value is YamllintWorkerResponse =>
    isUnknownRecord(value) && (value["ok"] === true || value["ok"] === false);

const createWorker = (): Worker =>
    new Worker(workerModuleUrl, {
        name: "yamllint-eslint-bridge",
        ...(isUsesTypeScriptSourceWorker && {
            execArgv: ["--experimental-strip-types"],
        }),
    });

const resetWorker = (): void => {
    const workerToTerminate = workerState.current;
    if (workerToTerminate === null) return;
    void (async () => {
        try {
            await workerToTerminate.terminate();
        } catch {
            // Worker termination failures are not actionable during cache recovery.
        }
    })();
    workerState.current = null;
};

const getWorker = (): Worker => {
    if (workerState.current === null) {
        workerState.current = createWorker();
        workerState.current.unref();
        workerState.current.once("error", () => {
            workerState.current = null;
        });
        workerState.current.once("exit", () => {
            workerState.current = null;
        });
    }
    return workerState.current;
};

const readWorkerResponse = (
    response: undefined | YamllintWorkerResponse
): SerializableYamllintResult => {
    assertDefined(response);
    if (response.ok) return response.result;
    const error = new Error(response.error.message);
    Object.defineProperty(error, "name", { value: response.error.name });
    if (isDefined(response.error.stack)) {
        Object.defineProperty(error, "stack", {
            value: response.error.stack,
        });
    }
    throw error;
};

/**
 * RunYamllintSynchronously run Yamllint synchronously contract.
 */
export const runYamllintSynchronously = (
    options: SerializableYamllintLintOptions
): SerializableYamllintResult => {
    const cacheKey = JSON.stringify(options);
    const cachedResult = lintResultCache.get(cacheKey);
    if (isDefined(cachedResult)) return cachedResult;
    const worker = getWorker();
    const signalBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
    const signal = new Int32Array(signalBuffer);
    const { port1, port2 } = new MessageChannel();
    // eslint-disable-next-line sdl/no-postmessage-without-origin-allowlist -- Node worker_threads postMessage accepts a transfer list, not a browser targetOrigin.
    worker.postMessage({ options, port: port2, signalBuffer }, [port2]);
    const waitResult = Atomics.wait(
        signal,
        0,
        0,
        keyIn(options, "timeoutMs") && typeof options.timeoutMs === "number"
            ? options.timeoutMs
            : WAIT_TIMEOUT_IN_MILLISECONDS
    );
    if (waitResult === "timed-out") {
        port1.close();
        resetWorker();
        throw new Error(
            "Timed out while waiting for the Yamllint worker to finish."
        );
    }
    if (Atomics.load(signal, 0) !== WORKER_DONE_STATE) {
        port1.close();
        throw new Error("Yamllint worker did not enter a completed state.");
    }
    const workerMessage = receiveMessageOnPort(port1);
    port1.close();
    const rawWorkerMessage: unknown = workerMessage?.message;
    const result = readWorkerResponse(
        isWorkerResponse(rawWorkerMessage) ? rawWorkerMessage : undefined
    );
    lintResultCache.set(cacheKey, result);
    return result;
};
