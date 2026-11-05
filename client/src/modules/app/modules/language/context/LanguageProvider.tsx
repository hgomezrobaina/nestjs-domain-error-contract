import { ReactNode, useState } from "react"
import { Languages } from "../interfaces"
import { LanguageContext } from "./language-context"

interface Props {
  children: ReactNode
}

export default function LanguageProvider({ children }: Props) {
  const [language, setLanguage] = useState<Languages>("es")

  return (
    <LanguageContext.Provider value={{ language, handleChangeLanguage: setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
