import { DispatchHttpException } from "@modules/app/domain/exceptions/dispatch-http-exception"
import { TranslationConfig } from "@modules/app/modules/language/interfaces"

// The server tells apart three carrier failures, because in the log they are
// three investigations. For whoever reads the screen they are one problem, so
// the three mirrors share their sentence.
class CarrierUnavailableHttpException extends DispatchHttpException {
  constructor(private readonly errorCode: string) {
    super()
  }

  code(): string {
    return this.errorCode
  }

  message(): TranslationConfig {
    return {
      en: "The carrier did not respond. Please try again.",
      es: "El transportista no respondió. Inténtalo de nuevo.",
    }
  }
}

export const CARRIER_HTTP_EXCEPTIONS: DispatchHttpException[] = [
  new CarrierUnavailableHttpException("carrier-rate-limit"),
  new CarrierUnavailableHttpException("carrier-connection-error"),
  new CarrierUnavailableHttpException("carrier-error"),
]
