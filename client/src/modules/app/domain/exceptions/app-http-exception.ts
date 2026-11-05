import {
  AppHttpError,
  AppHttpErrorParam,
} from "@modules/app/modules/http/domain/http-error";
import { TranslationConfig } from "@modules/app/modules/language/interfaces";
import { AppError } from "./app-error";

// The client's mirror of a server exception. It recognises by `code` and nothing
// else, and its message is a value with both languages inside, not a key. It is an
// AppError itself, so the resolver hands it to the UI as it is.
export abstract class AppHttpException extends AppError {
  private _params: AppHttpErrorParam[] = [];

  abstract code(): string;
  abstract message(): TranslationConfig;

  // The params arrive after recognising: the catalogue is declared without data,
  // and the data only exists in the concrete failure.
  setParams(value: AppHttpErrorParam[]) {
    this._params = value;
  }

  matches(error: AppHttpError): boolean {
    return this.code() === error.code;
  }

  searchParam(key: string): string | null {
    return this._params.find((p) => p.name === key)?.value ?? null;
  }
}
