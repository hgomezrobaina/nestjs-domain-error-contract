import { useContext } from "react";
import { LanguageContext } from "../context/language-context";

export default function useLanguage() {
  const { language, handleChangeLanguage } = useContext(LanguageContext);

  return { language, handleChangeLanguage };
}
