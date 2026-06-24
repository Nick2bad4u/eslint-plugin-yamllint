import type { MessagePort } from "node:worker_threads";

/**
 * SerializableYamllintLintOptions serializable yamllint lint options contract.
 */
export type SerializableYamllintLintOptions = Readonly<{
    code: string;
    codeFilename: string;
    configFile?: string;
    cwd?: string;
    noWarnings?: boolean;
    strict?: boolean;
    timeoutMs?: number;
}>;

/**
 * SerializableYamllintMessage serializable yamllint message contract.
 */
export type SerializableYamllintMessage = Readonly<{
    column: number;
    level: string;
    line: number;
    message: string;
    rule?: string;
}>;

/**
 * SerializableYamllintResult serializable yamllint result contract.
 */
export type SerializableYamllintResult = Readonly<{
    messages: readonly SerializableYamllintMessage[];
}>;
/**
 * YamllintWorkerErrorResponse yamllint worker error response contract.
 */
export type YamllintWorkerErrorResponse = Readonly<{
    error: Readonly<{ message: string; name: string; stack?: string }>;
    ok: false;
}>;
/**
 * YamllintWorkerRequest yamllint worker request contract.
 */
export type YamllintWorkerRequest = Readonly<{
    options: SerializableYamllintLintOptions;
    port: MessagePort;
    signalBuffer: SharedArrayBuffer;
}>;
/**
 * YamllintWorkerResponse yamllint worker response contract.
 */
export type YamllintWorkerResponse =
    | YamllintWorkerErrorResponse
    | YamllintWorkerSuccessResponse;
/**
 * YamllintWorkerSuccessResponse yamllint worker success response contract.
 */
export type YamllintWorkerSuccessResponse = Readonly<{
    ok: true;
    result: SerializableYamllintResult;
}>;
