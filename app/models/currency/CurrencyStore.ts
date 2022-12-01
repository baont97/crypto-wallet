import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { CurrencyModel } from "./CurrencyStore.models"

/**
 * A CurrencyStore model.
 */
export const CurrencyStoreModel = types
  .model("CurrencyStore")
  .props({
    currencies: types.optional(types.array(CurrencyModel), []),
  })
  .views((self) => ({
    get isHaveCurrency() {
      return self.currencies.length > 0
    },
    filterCurrencies(keyword: string = "") {
      return self.currencies.filter((item) =>
        (item.name.toLowerCase() + item.shortName.toLowerCase()).includes(keyword.toLowerCase()),
      )
    },
  }))
  .actions(withSetPropAction)
  .actions((self) => ({
    clearCurrency() {
      self.currencies.replace([])
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
