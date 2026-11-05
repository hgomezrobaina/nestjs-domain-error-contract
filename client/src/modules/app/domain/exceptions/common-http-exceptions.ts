import { TranslationConfig } from "@modules/app/modules/language/interfaces";
import { AppHttpException } from "./app-http-exception";

// Thrown by Nest's throttler, not by any module: the server's filter derives
// "too-many-requests" from the 429. Any endpoint can return it.
export class TooManyRequestsHttpException extends AppHttpException {
  code(): string {
    return "too-many-requests";
  }

  message(): TranslationConfig {
    return {
      en: "Too many attempts. Try again in a few minutes.",
      es: "Demasiados intentos. Inténtalo de nuevo en unos minutos.",
    };
  }
}

export const COMMON_HTTP_EXCEPTIONS: AppHttpException[] = [
  new TooManyRequestsHttpException(),
];
