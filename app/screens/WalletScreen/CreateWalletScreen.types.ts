export type CreateWalletType = "createNewWallet" | "importWallet"
export interface ImportWalletModel {
  walletName: string
  mnemonic: string
}
