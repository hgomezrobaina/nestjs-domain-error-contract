import { AppError } from "@modules/app/domain/exceptions/app-error";

export type HttpResponseResult<T = null> =
  { data: T; errors: null } | { errors: AppError[]; data: null };
