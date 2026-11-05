import { AppHttpException } from "./app-http.exception";

// The shape of the error inside the response body, whoever produced it.
export type AppErrorResponse = ReturnType<AppHttpException["response"]>;
