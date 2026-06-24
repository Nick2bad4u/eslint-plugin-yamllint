import {
    MessageChannel,
    receiveMessageOnPort,
    Worker,
} from "node:worker_threads";
import { assertDefined, isDefined, safeCastTo } from "ts-extras";

import type {
    SerializableYamllintLintOptions,
    SerializableYamllintResult,
    YamllintWorkerResponse,
} from "./yamllint-worker-types.js";

const WAIT_TIMEOUT_IN_MILLISECONDS = 30_000 as const;
const WORKER_DONE_STATE = 1 as const;
const lintResultCache = new Map<string, SerializableYamllintResult>();
let yamllintWorker: null | Worker = null;
const isUsesTypeScriptSourceWorker = import.meta.url.endsWith(".ts");
const workerModuleUrl = new URL(
    isUsesTypeScriptSourceWorker
        ? "./yamllint-worker.ts"
        : "./yamllint-worker.js",
    import.meta.url
);

const createWorker = (): Worker =>
    new Worker(workerModuleUrl, {
        name: "yamllint-eslint-bridge",
        ...(isUsesTypeScriptSourceWorker && {
            execArgv: ["--experimental-strip-types"],
        }),
    });

const resetWorker = (): void => {
    const workerToTerminate = yamllintWorker;
    if (workerToTerminate === null) return;
    void (async () => {
        try {
            await workerToTerminate.terminate();
        } catch {}
    })();
    yamllintWorker = null;
};

const getWorker = (): Worker => {
    if (yamllintWorker === null) {
        yamllintWorker = createWorker();
        yamllintWorker.unref();
        yamllintWorker.once("error", () => {
            yamllintWorker = null;
        });
        yamllintWorker.once("exit", () => {
            yamllintWorker = null;
        });
    }
    return yamllintWorker;
};

const readWorkerResponse = (
    response: undefined | YamllintWorkerResponse
): SerializableYamllintResult => {
    assertDefined(response);
    if (response.ok) return response.result;
    const error = new Error(response.error.message);
    error.name = response.error.name;
    if (isDefined(response.error.stack)) error.stack = response.error.stack;
    throw error;
};

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
    worker.postMessage({ options, port: port2, signalBuffer }, [port2]);
    const waitResult = Atomics.wait(
        signal,
        0,
        0,
        "timeoutMs" in options && typeof options.timeoutMs === "number"
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
    const result = readWorkerResponse(
        safeCastTo<undefined | YamllintWorkerResponse>(workerMessage?.message)
    );
    lintResultCache.set(cacheKey, result);
    return result;
};
