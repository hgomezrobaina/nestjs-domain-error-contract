import { DispatchError } from "@modules/app/domain/exceptions/dispatch-error"

export type HttpResponseResult<T = null> =
  | { data: T; errors: null }
  | { errors: DispatchError[]; data: null }
