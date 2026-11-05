import { DispatchHttpError } from "@modules/app/modules/http/domain/http-error"
import { DispatchError } from "./dispatch-error"
import { DispatchHttpException } from "./dispatch-http-exception"

// One catalogue per operation: errors() lists what this operation knows how to
// explain, default() is the sentence for everything else.
//
// `find` returns the first match, so a catalogue that declares its own variant of
// a code must not also spread the common set that contains the generic one.
export abstract class DispatchHttpExceptionResolver {
  protected abstract errors(): DispatchHttpException[]
  protected abstract default(): DispatchError

  execute(error: DispatchHttpError): DispatchError[] {
    const found = this.errors().find((e) => e.matches(error))

    if (!found) {
      return [this.default()]
    }

    found.setParams(error.params)

    return [found.error()]
  }
}
