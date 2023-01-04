import { Platform } from "react-native"

export const SUPPORTED_CHAINS = {
  ETH: "ETH",
  BTC: "BTC",
}

export type SupportedChains = keyof typeof SUPPORTED_CHAINS

export const WALLET_PATHS = {
  ETH: "m/44'/60'/0'/0/0",
  BTC: "m/44'/0'/0'/0/0",
}

export type WalletPath = keyof typeof WALLET_PATHS
