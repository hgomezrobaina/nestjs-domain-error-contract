import useLanguage from "../../hooks/useLanguage"

export default function LanguageSwitch() {
  const { language, handleChangeLanguage } = useLanguage()

  return (
    <div className="language-switch">
      <button disabled={language === "es"} onClick={() => handleChangeLanguage("es")}>
        ES
      </button>
      <button disabled={language === "en"} onClick={() => handleChangeLanguage("en")}>
        EN
      </button>
    </div>
  )
}
