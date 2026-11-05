import { TranslationConfig } from "@modules/app/modules/language/interfaces";

// What the UI consumes: a code and a sentence in every language. The mirrors of
// the server's exceptions extend it, and so do the errors that never crossed
// HTTP, like the default of each operation.
export abstract class AppError {
  abstract code(): string;
  abstract message(): TranslationConfig;
}
