import { createContext } from "react"
import { Languages } from "../interfaces"

interface LanguageContextProps {
  language: Languages
  handleChangeLanguage: (language: Languages) => void
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  handleChangeLanguage: () => {},
})
