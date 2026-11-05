import { DispatchError } from "@modules/app/domain/exceptions/dispatch-error"
import { useCallback } from "react"
import { toast } from "react-hot-toast"
import useLanguage from "../../language/hooks/useLanguage"
import { TranslationConfig } from "../../language/interfaces"

type ShowToastProps = { message: TranslationConfig; id?: string }

export default function useToast() {
  const { language } = useLanguage()

  const toastSuccess = useCallback(
    ({ message, id }: ShowToastProps) => {
      toast.success(message[language], { id: id, position: "top-right" })
    },
    [language],
  )

  const toastError = useCallback(
    ({ message, id }: ShowToastProps) => {
      toast.error(message[language], { id: id, position: "top-right" })
    },
    [language],
  )

  // The language is resolved where the sentence is painted, and nowhere else.
  const toastDispatchError = useCallback(
    (errors: DispatchError[]) => {
      for (const e of errors) {
        toastError({ message: e.msg(), id: e.id() })
      }
    },
    [toastError],
  )

  return { toastSuccess, toastError, toastDispatchError }
}
