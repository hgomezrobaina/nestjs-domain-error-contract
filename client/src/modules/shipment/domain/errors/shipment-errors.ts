import { DispatchError } from "@modules/app/domain/exceptions/dispatch-error"
import { TranslationConfig } from "@modules/app/modules/language/interfaces"

export class DispatchShipmentError extends DispatchError {
  id(): string {
    return "dispatch-shipment-error"
  }

  msg(): TranslationConfig {
    return {
      en: "The shipment could not be dispatched.",
      es: "No se pudo despachar el envío.",
    }
  }
}

export class PrintLabelError extends DispatchError {
  id(): string {
    return "print-label-error"
  }

  msg(): TranslationConfig {
    return {
      en: "The label could not be printed.",
      es: "No se pudo imprimir la etiqueta.",
    }
  }
}
