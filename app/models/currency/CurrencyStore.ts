import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { Currency, CurrencyModel } from "./CurrencyStore.models"

/**
 * A CurrencyStore model.
 */
export const CurrencyStoreModel = types
  .model("CurrencyStore")
  .props({
    currencies: types.optional(types.array(CurrencyModel), []),
    activeCurrencyIds: types.optional(types.array(types.string), []),
    customCurrencies: types.optional(types.array(CurrencyModel), []),
  })
  .views((self) => ({
    get isHaveCurrency() {
      return self.currencies.length > 0
    },
    get allCurrencies() {
      return self.currencies.concat(self.customCurrencies)
    },
    get activeCurrencies() {
      return this.allCurrencies.filter((item) => self.activeCurrencyIds.includes(item.id))
    },
    filterCurrencies(cur: Currency[], keyword: string = "") {
      return cur.filter((item) =>
        (item.name.toLowerCase() + item.shortName.toLowerCase()).includes(keyword.toLowerCase()),
      )
    },
    checkIsActive(id: Currency["id"] = "") {
      return self.activeCurrencyIds.findIndex((item) => item === id) !== -1
    },
  }))
  .actions(withSetPropAction)
  .actions((self) => ({
    clearCurrency() {
      self.currencies.replace([])
    },
    toggleCurrency(id: Currency["id"] = "") {
      const isActive = self.checkIsActive(id)
      if (isActive) {
        self.activeCurrencyIds.replace(self.activeCurrencyIds.filter((item) => item !== id))
      } else {
        self.activeCurrencyIds.replace([...self.activeCurrencyIds, id])
      }
    },
    addCustomCurrency(input: Currency) {
      self.setProp("customCurrencies", [...self.customCurrencies, input])
    },
  }))

/**
 * The CurrencyStore instance.
 */
export interface CurrencyStore extends Instance<typeof CurrencyStoreModel> {}
/**
 * The data of a CurrencyStore.
 */
export interface CurrencyStoreSnapshot extends SnapshotOut<typeof CurrencyStoreModel> {}
