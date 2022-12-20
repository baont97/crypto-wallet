import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SUPPORTED_CHAINS } from "../../config/contants"

export const BalanceModel = types.model("Balance").props({
  currencyId: types.maybe(types.string),
  native: types.maybe(types.number),
  fiat: types.maybe(types.number),
  exchangeRate: types.maybe(types.number),
})

type BalanceType = Instance<typeof BalanceModel>
export interface Balance extends BalanceType {}
type BalanceSnapshotType = SnapshotOut<typeof BalanceModel>
export interface BalanceSnapshot extends BalanceSnapshotType {}

export const AddressModel = types.model("Address").props({
  id: types.maybe(types.string),
  chain: types.enumeration("AddressChain", [SUPPORTED_CHAINS.BTC, SUPPORTED_CHAINS.ETH]),
  address: types.maybe(types.string),
})

type AddressType = Instance<typeof AddressModel>
export interface Address extends AddressType {}
type AddressSnapshotType = SnapshotOut<typeof AddressModel>
export interface AddressSnapshot extends AddressSnapshotType {}

export const WalletModel = types.model("Wallet").props({
  id: types.maybe(types.string),
  name: types.maybe(types.string),
  addresses: types.optional(types.array(AddressModel), []),
})

type WalletType = Instance<typeof WalletModel>
export interface Wallet extends WalletType {}
type WalletSnapshotType = SnapshotOut<typeof WalletModel>
export interface WalletSnapshot extends WalletSnapshotType {}
