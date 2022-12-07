import randomWords from "random-words"
import { translate, TxKeyPath } from "../i18n"
import { v4 as uuid } from "uuid"

export const getRandomName = (): string => {
  return randomWords(1)[0]
}

export const capitalize = (text: string): string => {
  if (!text) return text
  return text[0].toUpperCase() + text.slice(1)
}

export type ErrorType = "required" | "invalid"

export const getFormErrorMessage = (fieldName: TxKeyPath, errorType: ErrorType): string => {
  return translate(("errorMessage." + errorType) as TxKeyPath, { fieldName: translate(fieldName) })
}

export const getRandomId = () => uuid()
