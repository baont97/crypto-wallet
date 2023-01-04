import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { DefaultActiveIds } from "../data/currency"
import { CurrencyStoreModel } from "./currency/CurrencyStore"
import { WalletStoreModel } from "./wallet/WalletStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  walletStore: types.optional(WalletStoreModel, { wallets: [], activeWalletId: "", balances: [] }),
  currencyStore: types.optional(CurrencyStoreModel, {
    currencies: [],
    activeCurrencyIds: DefaultActiveIds,
  }),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
