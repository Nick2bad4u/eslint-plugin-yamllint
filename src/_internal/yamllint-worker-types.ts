import type { MessagePort } from "node:worker_threads";

export type SerializableYamllintLintOptions = Readonly<{
    code: string;
    codeFilename: string;
    configFile?: string;
    cwd?: string;
    noWarnings?: boolean;
    strict?: boolean;
    timeoutMs?: number;
}>;

export type SerializableYamllintMessage = Readonly<{
    column: number;
    level: string;
    line: number;
    message: string;
    rule?: string;
}>;

export type SerializableYamllintResult = Readonly<{
    messages: readonly SerializableYamllintMessage[];
}>;
export type YamllintWorkerErrorResponse = Readonly<{
    error: Readonly<{ message: string; name: string; stack?: string }>;
    ok: false;
}>;
export type YamllintWorkerRequest = Readonly<{
    options: SerializableYamllintLintOptions;
    port: MessagePort;
    signalBuffer: SharedArrayBuffer;
}>;
export type YamllintWorkerResponse =
    | YamllintWorkerErrorResponse
    | YamllintWorkerSuccessResponse;
export type YamllintWorkerSuccessResponse = Readonly<{
    ok: true;
    result: SerializableYamllintResult;
}>;
