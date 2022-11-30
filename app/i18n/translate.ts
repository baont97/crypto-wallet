import i18n from "i18n-js"
import { TxKeyPath } from "./i18n"

/**
 * Translates text.
 *
 * @param key The i18n key.
 * @param options The i18n options.
 * @returns The translated text.
 *
 * @example
 * Translations:
 *
 * ```en.ts
 * {
 *  "hello": "Hello, {{name}}!"
 * }
 * ```
 *
 * Usage:
 * ```ts
 * import { translate } from "i18n-js"
 *
 * translate("common.ok", { name: "world" })
 * // => "Hello world!"
 * ```
 */
export function translate(
  key: TxKeyPath,
  variables: string[] = [],
  options?: i18n.TranslateOptions,
) {
  let res = i18n.t(key, options)

  if (variables.length) {
    variables.forEach((value, index) => {
      res = res.replace(`{${index}}`, value)
    })
  }

  return res
}
