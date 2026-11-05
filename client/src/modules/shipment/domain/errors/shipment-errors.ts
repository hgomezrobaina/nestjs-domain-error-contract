import { AppError } from "@modules/app/domain/exceptions/app-error";
import { TranslationConfig } from "@modules/app/modules/language/interfaces";

export class DispatchShipmentError extends AppError {
  code(): string {
    return "dispatch-shipment-error";
  }

  message(): TranslationConfig {
    return {
      en: "The shipment could not be dispatched.",
      es: "No se pudo despachar el envío.",
    };
  }
}

export class PrintLabelError extends AppError {
  code(): string {
    return "print-label-error";
  }

  message(): TranslationConfig {
    return {
      en: "The label could not be printed.",
      es: "No se pudo imprimir la etiqueta.",
    };
  }
}
