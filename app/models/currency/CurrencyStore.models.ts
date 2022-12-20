import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SUPPORTED_CHAINS } from "../../config/contants"

export const CurrencyModel = types.model("Currency").props({
  id: types.maybe(types.string),
  name: types.maybe(types.string),
  shortName: types.maybe(types.string),
  decimals: types.maybe(types.number),
  contractAddress: types.maybe(types.string),
  image: types.maybe(types.string),
  priceChangePercentage24h: types.maybe(types.number),
  chain: types.enumeration("AddressChain", [SUPPORTED_CHAINS.BTC, SUPPORTED_CHAINS.ETH]),
})

type CurrencyType = Instance<typeof CurrencyModel>
export interface Currency extends CurrencyType {}
type CurrencySnapshotType = SnapshotOut<typeof CurrencyModel>
export interface CurrencySnapshot extends CurrencySnapshotType {}
