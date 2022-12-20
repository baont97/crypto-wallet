import { ethers } from "ethers"

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

/**
 * Generate wallet
 */

export interface Menemonic {
  mnemonic: string[]
  shuffledMnemonic: string[]
}

export interface GenerateMnemonicProps {
  seedByte: number
}

export interface GenerateMnemonicResult extends Menemonic {}

/**
 * Get balance
 */

export type NetworkDetail = {
  name: string
  chainId: string
  ensAddress: string
}

export interface GetBalanceProps {
  network: string
  address: string
  networkDetail?: NetworkDetail
}

/**
 * Get contract balance
 */

export interface GetContractBalanceProps {
  network: string
  contractAddress: string
  contractAbi: ethers.ContractInterface
  address: string
  networkDetail?: NetworkDetail
}

/**
 * Get gas price
 */
export interface GetGasPriceProps {
  network: string
  networkDetail?: NetworkDetail
}

/**
 * Get nonce
 */
export interface GetNonceProps {
  network: string
  address: string
  networkDetail?: NetworkDetail
  blockTag?: string
}

/**
 * Sign transaction
 */
export interface SignTransaction {
  keystore: any
  password: string
  nonce: ethers.BigNumber
  gasLimit: ethers.BigNumber
  gasPrice: ethers.BigNumber
  toAddress: string
  chainId: number
  amount: string
  data: any
}

/**
 * Send transaction
 */
export interface SendTransactionProps {
  network: string
  signedTransaction: string
  networkDetail?: NetworkDetail
}

/**
 * Contract Transaction
 */
export interface ContractTransactionProps {
  network: string
  contractAddress: string
  contractAbi: ethers.ContractInterface
  keystore: any
  password: string
  nonce: ethers.BigNumber
  gasLimit: ethers.BigNumber
  gasPrice: ethers.BigNumber
  toAddress: string
  amount: string
  decims: number
  networkDetail?: NetworkDetail
}

/**
 *
 */
export interface WaitforTransactionProps {
  network: string
  transactionHash: string
  networkDetail?: NetworkDetail
}

/**
 * Import mnemonic
 */
export interface ImportMnemonicProps {
  mnemonic: string
  mnemonicPassword?: string
  password: string
  path?: string
  needPrivateKey?: boolean
  needPublicKey?: boolean
  needKeystore?: boolean
}
