export type Languages = "en" | "es";

export type TranslationConfig<V = string> = { [language in Languages]: V };
