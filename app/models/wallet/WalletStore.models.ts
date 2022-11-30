import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const BalanceModel = types.model("Currency").props({
  currencyId: types.maybe(types.string),
  native: types.maybe(types.number),
  fiat: types.maybe(types.number),
})

type BalanceType = Instance<typeof BalanceModel>
export interface Balance extends BalanceType {}
type BalanceSnapshotType = SnapshotOut<typeof BalanceModel>
export interface BalanceSnapshot extends BalanceSnapshotType {}

export const WalletModel = types.model("Wallet").props({
  id: types.maybe(types.string),
  name: types.maybe(types.string),
  address: types.maybe(types.string),
})

type WalletType = Instance<typeof WalletModel>
export interface Wallet extends WalletType {}
type WalletSnapshotType = SnapshotOut<typeof WalletModel>
export interface WalletSnapshot extends WalletSnapshotType {}
