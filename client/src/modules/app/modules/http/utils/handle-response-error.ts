import axios from "axios"
import { DispatchHttpError, unknownError } from "../domain/http-error"

export function handleResponseError(error: unknown): DispatchHttpError {
  if (!axios.isAxiosError(error)) {
    return unknownError()
  }

  const payload = (error.response?.data as { error?: Partial<DispatchHttpError> })?.error

  // The server message is kept even though this client never paints it:
  // it is the fallback for a code the client does not know yet.
  return {
    message: payload?.message ?? "",
    status: error.response?.status ?? 500,
    code: payload?.code ?? "",
    params: Array.isArray(payload?.params) ? payload.params : [],
  }
}
