import { TranslationConfig } from "@modules/app/modules/language/interfaces"

// What the UI consumes: an id and a sentence in every language.
export abstract class DispatchError {
  abstract id(): string
  abstract msg(): TranslationConfig
}
