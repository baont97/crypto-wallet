import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { BalanceModel, Wallet, WalletModel } from "./WalletStore.models"

/**
 * A WalletStore model.
 */
export const WalletStoreModel = types
  .model("WalletStore")
  .props({
    wallets: types.optional(types.array(WalletModel), []),
    activeWalletId: types.maybeNull(types.string),
    balances: types.optional(types.array(BalanceModel), []),
  })
  .views((self) => ({
    get isHaveWallet() {
      return self.wallets.length > 0
    },
    get activeWallet() {
      return self.wallets.find((item) => item.id === self.activeWalletId)
    },
    get totalBalanceInFiat() {
      return self.balances.reduce((acc, cur) => (acc += cur.fiat), 0)
    },
    getBalanceByCurrencyId(input: string) {
      return (
        self.balances.find((item) => item.currencyId === input) || {
          native: 0,
          fiat: 0,
          currencyId: input,
          exchangeRate: 1,
        }
      )
    },
  }))
  .actions(withSetPropAction)
  .actions((self) => ({
    updateWalletList: function (input: Wallet, type: "add" | "remove" | "edit") {
      switch (type) {
        case "add":
          if (!self.wallets.length) {
            self.setProp("activeWalletId", input.id)
          }
          self.wallets.push(input)
          break
        case "remove":
          if (self.wallets.length === 1) {
            self.setProp("activeWalletId", input.id)
          }
          self.wallets.replace(self.wallets.filter((item) => item.id !== input.id))
          break
        case "edit":
          const index = self.wallets.findIndex((item) => item.id === input.id)
          if (index !== -1) {
            self.wallets[index] = input
          }
      }
    },
    clearWallet() {
      self.wallets.replace([])
      self.activeWalletId = ""
    },
  }))

/**
 * The WalletStore instance.
 */
export interface WalletStore extends Instance<typeof WalletStoreModel> {}
/**
 * The data of a WalletStore.
 */
export interface WalletStoreSnapshot extends SnapshotOut<typeof WalletStoreModel> {}
