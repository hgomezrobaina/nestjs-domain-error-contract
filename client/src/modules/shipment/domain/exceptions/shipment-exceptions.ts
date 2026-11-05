import { AppHttpException } from "@modules/app/domain/exceptions/app-http-exception";
import { TranslationConfig } from "@modules/app/modules/language/interfaces";

export class ShipmentWeightExceededHttpException extends AppHttpException {
  code(): string {
    return "shipment-weight-exceeded";
  }

  message(): TranslationConfig {
    const max = this.searchParam("maxWeight");
    const actual = this.searchParam("actual");

    return {
      en: `This shipment weighs ${actual} kg and the carrier accepts ${max}.`,
      es: `Este envío pesa ${actual} kg y el transportista admite ${max}.`,
    };
  }
}

export class ShipmentAlreadyDispatchedHttpException extends AppHttpException {
  code(): string {
    return "shipment-already-dispatched";
  }

  message(): TranslationConfig {
    return {
      en: "This shipment has already been dispatched.",
      es: "Este envío ya fue despachado.",
    };
  }
}

export class DestinationNotCoveredHttpException extends AppHttpException {
  code(): string {
    return "destination-not-covered";
  }

  message(): TranslationConfig {
    const country = this.searchParam("country");

    return {
      en: `This carrier does not deliver to ${country}. Choose another one.`,
      es: `Este transportista no entrega en ${country}. Elige otro.`,
    };
  }
}

// Same code as the generic TooManyRequestsHttpException, another sentence:
// on the print button "try again in a few minutes" would be a lie.
export class TooManyLabelRequestsHttpException extends AppHttpException {
  code(): string {
    return "too-many-requests";
  }

  message(): TranslationConfig {
    return {
      en: "You have printed the three labels this hour allows.",
      es: "Has impreso las tres etiquetas que permite esta hora.",
    };
  }
}
