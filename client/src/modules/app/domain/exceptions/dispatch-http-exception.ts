import { DispatchHttpError, DispatchHttpErrorParam } from "@modules/app/modules/http/domain/http-error"
import { TranslationConfig } from "@modules/app/modules/language/interfaces"
import { DispatchError } from "./dispatch-error"

// The client's mirror of a server exception. It recognises by `code` and nothing
// else, and its message is a value with both languages inside, not a key.
export abstract class DispatchHttpException {
  private _params: DispatchHttpErrorParam[] = []

  abstract code(): string
  abstract message(): TranslationConfig

  // The params arrive after recognising: the catalogue is declared without data,
  // and the data only exists in the concrete failure.
  setParams(value: DispatchHttpErrorParam[]) {
    this._params = value
  }

  matches(error: DispatchHttpError): boolean {
    return this.code() === error.code
  }

  searchParam(key: string): string | null {
    return this._params.find((p) => p.name === key)?.value ?? null
  }

  error(): DispatchError {
    return new DispatchHttpExceptionError(this)
  }
}

class DispatchHttpExceptionError extends DispatchError {
  constructor(private readonly exception: DispatchHttpException) {
    super()
  }

  id(): string {
    return this.exception.code()
  }

  msg(): TranslationConfig {
    return this.exception.message()
  }
}
