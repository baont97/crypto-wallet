/**
 * Create wallet
 */
export interface Web3Wallet {
    address: string
    publicKey: string
    privateKey: string
    keystore: any
  }
  
  export interface CreateWalletProps {
    password: string
    path?: string
    seedByte?: number
    needPrivateKey?: boolean
    needPublicKey?: boolean
    needKeystore?: boolean
    mnemonic: string
    mnemonicPassword?: string
  }
  
  export interface CreateWalletResult extends Web3Wallet {}