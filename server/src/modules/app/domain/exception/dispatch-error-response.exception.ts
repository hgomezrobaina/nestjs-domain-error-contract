import { HttpStatus } from "@nestjs/common"
import { DispatchHttpException } from "./dispatch-http.exception"

export type DispatchErrorResponse = ReturnType<DispatchHttpException["response"]>

// A function and not a shared constant: what it returns travels to the client,
// and nobody should be able to edit everybody else's error on the way.
export function unexpectedErrorResponse(): DispatchErrorResponse {
  return {
    message: "There was an unexpected server error",
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    code: "internal-server-error",
    params: [],
  }
}
