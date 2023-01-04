// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { BigNumber, ethers } from "ethers"

import {
  ContractTransactionProps,
  CreateWalletProps,
  CreateWalletResult,
  GenerateMnemonicProps,
  GenerateMnemonicResult,
  GetBalanceProps,
  GetContractBalanceProps,
  GetGasPriceProps,
  GetNonceProps,
  ImportMnemonicProps,
  SendTransactionProps,
  SignTransaction,
  WaitforTransactionProps,
  Web3Wallet,
} from "./ether.types"

const createWallet = (props: CreateWalletProps): Promise<CreateWalletResult> => {
  let {
    password,
    path = "m/44'/60'/0'/0/0",
    needPrivateKey = false,
    needPublicKey = false,
    needKeystore = true,
    mnemonic,
    mnemonicPassword = "",
  } = props

  return new Promise((fulfill, reject) => {
    try {
      ethers.utils.HDNode.fromMnemonic(mnemonic, mnemonicPassword)
        .then((node) => {
          let hdnode = node.derivePath(path)
          let response: Web3Wallet = {
            address: hdnode.address,
            publicKey: "",
            privateKey: "",
            keystore: {},
          }
          if (needPublicKey) {
            response.publicKey = hdnode.publicKey
          }
          if (needPrivateKey) {
            response.privateKey = hdnode.privateKey
          }

          if (needKeystore) {
            let wallet = new ethers.Wallet(mnemonicPassword ? hdnode.privateKey : hdnode)
            wallet
              .encrypt(password)
              .then((res) => {
                let jsonObj = JSON.parse(res)

                response.keystore = jsonObj

                fulfill(response)
              })
              .catch((err) => {
                reject(err)
              })
          } else {
            fulfill(response)
          }
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export function getBalance(props: GetBalanceProps) {
  const { network, address, networkDetail = { name: "", chainId: "", ensAddress: "" } } = props
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.providers.JsonRpcProvider | ethers.providers.BaseProvider
      if (network === "" || network === undefined) {
        provider = ethers.providers.getDefaultProvider()
      } else {
        if (
          JSON.stringify(networkDetail) ===
          JSON.stringify({ name: "", chainId: "", ensAddress: "" })
        ) {
          provider = new ethers.providers.JsonRpcProvider(network)
        } else {
          provider = new ethers.providers.JsonRpcProvider(network, networkDetail as any)
        }
      }

      provider
        .getBalance(address)
        .then((res) => {
          fulfill(res)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export function getContractBalance(props: GetContractBalanceProps) {
  const {
    network,
    contractAddress,
    contractAbi,
    address,
    networkDetail = { name: "", chainId: "", ensAddress: "" },
  } = props
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.providers.JsonRpcProvider | ethers.providers.BaseProvider
      if (network === "" || network === undefined) {
        provider = ethers.providers.getDefaultProvider()
      } else {
        if (
          JSON.stringify(networkDetail) ===
          JSON.stringify({ name: "", chainId: "", ensAddress: "" })
        ) {
          provider = new ethers.providers.JsonRpcProvider(network)
        } else {
          provider = new ethers.providers.JsonRpcProvider(network, networkDetail as any)
        }
      }

      let contract = new ethers.Contract(contractAddress, contractAbi, provider)

      contract
        .balanceOf(address)
        .then((res) => {
          fulfill(res)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

function getGasPrice(props: GetGasPriceProps): Promise<ethers.BigNumber> {
  const { network, networkDetail = { name: "", chainId: "", ensAddress: "" } } = props

  return new Promise((fulfill, reject) => {
    try {
      let provider
      if (network === "" || network === undefined) {
        provider = ethers.providers.getDefaultProvider()
      } else {
        if (
          JSON.stringify(networkDetail) ===
          JSON.stringify({ name: "", chainId: "", ensAddress: "" })
        ) {
          provider = new ethers.providers.JsonRpcProvider(network)
        } else {
          provider = new ethers.providers.JsonRpcProvider(network, networkDetail as any)
        }
      }

      provider
        .getGasPrice()
        .then((res) => {
          fulfill(res)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export function getNonce(props: GetNonceProps): Promise<ethers.BigNumber> {
  const {
    network,
    address,
    networkDetail = { name: "", chainId: "", ensAddress: "" },
    blockTag = "pending",
  } = props

  return new Promise((fulfill, reject) => {
    let provider
    if (network === "" || network === undefined) {
      provider = ethers.providers.getDefaultProvider()
    } else {
      if (
        JSON.stringify(networkDetail) === JSON.stringify({ name: "", chainId: "", ensAddress: "" })
      ) {
        provider = new ethers.providers.JsonRpcProvider(network)
      } else {
        provider = new ethers.providers.JsonRpcProvider(network, networkDetail as any)
      }
    }

    provider
      .getTransactionCount(address, blockTag)
      .then((nonce) => {
        fulfill(nonce)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function signTransaction(props: SignTransaction): Promise<string> {
  const { keystore, password, nonce, gasLimit, gasPrice, toAddress, chainId, amount, data } = props
  return new Promise((fulfill, reject) => {
    try {
      ethers.Wallet.fromEncryptedJson(keystore, password)
        .then((res) => {
          let wallet = res
          let realAmount = ethers.utils.parseEther(amount)

          let tx = {
            nonce: nonce,
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            to: toAddress,
            chainId: chainId,
            value: realAmount,
            data: data,
          }
          wallet
            .signTransaction(tx)
            .then((res) => {
              fulfill(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export function sendTransaction(
  props: SendTransactionProps,
): Promise<ethers.providers.TransactionResponse> {
  const {
    network,
    signedTransaction,
    networkDetail = { name: "", chainId: "", ensAddress: "" },
  } = props

  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.providers.BaseProvider
      if (network === "" || network === undefined) {
        provider = ethers.providers.getDefaultProvider()
      } else {
        if (
          JSON.stringify(networkDetail) ===
          JSON.stringify({ name: "", chainId: "", ensAddress: "" })
        ) {
          provider = new ethers.providers.JsonRpcProvider(network)
        } else {
          provider = new ethers.providers.JsonRpcProvider(network, networkDetail as any)
        }
      }

      provider
        .sendTransaction(signedTransaction)
        .then((res) => {
          fulfill(res)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export function contractTransaction(
  props: ContractTransactionProps,
): Promise<ethers.providers.TransactionResponse> {
  let {
    network,
    contractAddress,
    contractAbi,
    keystore,
    password,
    nonce,
    gasLimit,
    gasPrice,
    toAddress,
    amount,
    decims,
    networkDetail = { name: "", chainId: "", ensAddress: "" },
  } = props
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.providers.BaseProvider
      if (network === "" || network === undefined) {
        provider = ethers.providers.getDefaultProvider()
      } else {
        if (
          JSON.stringify(networkDetail) ===
          JSON.stringify({ name: "", chainId: "", ensAddress: "" })
        ) {
          provider = new ethers.providers.JsonRpcProvider(network)
        } else {
          provider = new ethers.providers.JsonRpcProvider(network, networkDetail as any)
        }
      }

      ethers.Wallet.fromEncryptedJson(keystore, password)
        .then((res) => {
          let wallet = res
          let realAmount = ethers.utils.parseUnits(amount, decims)

          let walletWithSigner = wallet.connect(provider)
          let contractWithSigner = new ethers.Contract(
            contractAddress,
            contractAbi,
            walletWithSigner,
          )

          function realTransfer() {
            let tx = {
              nonce: nonce,
              gasLimit: gasLimit,
              gasPrice: gasPrice,
            }

            contractWithSigner
              .transfer(toAddress, realAmount, tx)
              .then((res) => {
                fulfill(res)
              })
              .catch((err) => {
                reject(err)
              })
          }

          if (gasLimit.isZero()) {
            contractWithSigner.estimateGas
              .transfer(toAddress, realAmount)
              .then((gas) => {
                gasLimit = gas
                realTransfer()
              })
              .catch((err) => {
                reject(err)
              })
          } else {
            realTransfer()
          }
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

function waitForContractTransaction(
  tx: ethers.providers.TransactionResponse,
): Promise<ethers.providers.TransactionReceipt> {
  return tx.wait()
}

export function waitForTransaction(
  props: WaitforTransactionProps,
): Promise<ethers.providers.TransactionReceipt> {
  const { network, transactionHash, networkDetail } = props
  return new Promise((fulfill, reject) => {
    try {
      let provider: ethers.providers.BaseProvider
      if (network === "" || network === undefined) {
        provider = ethers.providers.getDefaultProvider()
      } else {
        if (
          JSON.stringify(networkDetail) ===
          JSON.stringify({ name: "", chainId: "", ensAddress: "" })
        ) {
          provider = new ethers.providers.JsonRpcProvider(network)
        } else {
          provider = new ethers.providers.JsonRpcProvider(network, networkDetail as any)
        }
      }

      provider
        .waitForTransaction(transactionHash)
        .then((res) => {
          fulfill(res)
        })
        .catch((err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 *
 *
 * @export
 * @param {string} mnemonic
 * @param {string} password
 * @param {string} [path="m/44'/60'/0'/0/0"]
 * @param {boolean} [needPrivateKey=false]
 * @param {boolean} [needPublicKey=false]
 * @param {boolean} [needKeystore=true]
 * @param {string} [mnemonicPassword='']
 * @return {Promise<{address:'',keystore:{},publicKey:'',privateKey:'',mnemonic:[],shuffleMnemonic[]}>}
 */
export function importMnemonic(props: ImportMnemonicProps): Promise<Web3Wallet> {
  let {
    mnemonic,
    password,
    path = "m/44'/60'/0'/0/0",
    needPrivateKey = false,
    needPublicKey = false,
    needKeystore = true,
    mnemonicPassword = "",
  } = props
  return new Promise((fulfill, reject) => {
    mnemonicPassword = mnemonicPassword ? mnemonicPassword : ""
    ethers.utils.HDNode.fromMnemonic(mnemonic, mnemonicPassword)
      .then((node) => {
        let hdnode = node.derivePath(path)
        let response: Web3Wallet = {
          address: hdnode.address,
          publicKey: "",
          privateKey: "",
          keystore: {},
        }

        if (needPublicKey) {
          response.publicKey = hdnode.publicKey
        }
        if (needPrivateKey) {
          response.privateKey = hdnode.privateKey
        }

        let wallet = new ethers.Wallet(mnemonicPassword ? hdnode.privateKey : hdnode)
        if (needKeystore) {
          wallet
            .encrypt(password)
            .then((res) => {
              let jsonObj = JSON.parse(res)

              response.keystore = jsonObj
              fulfill(response)
            })
            .catch((err) => {
              reject(err)
            })
        } else {
          fulfill(response)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function shuffleArray<T>(origin: T[]): T[] {
  var array = origin.slice()
  return ethers.utils.shuffled(array)
}

const generateMnemonic = (props?: GenerateMnemonicProps): GenerateMnemonicResult => {
  const seedByte = props?.seedByte || 16

  //16-12words 20-15words 24-18words 28-21words 32-24words
  const privateSeed = ethers.utils.randomBytes(seedByte)
  //2048 words
  const mnemonic = ethers.utils.entropyToMnemonic(privateSeed).split(" ")
  let shuffledMnemonic = shuffleArray(mnemonic)

  return {
    mnemonic,
    shuffledMnemonic,
  }
}

function bigNumberFormatUnits(value, decims = 18): ethers.BigNumber {
  return ethers.utils.formatUnits(value, decims) as any
}

function bigNumberParseUnits(value, decims = 18) {
  return ethers.utils.parseUnits(value, decims)
}

function getEventNameID(eventName) {
  return ethers.utils.id(eventName)
}

function hexZeroPad(value, length) {
  return ethers.utils.hexZeroPad(value, length)
}

function hexString(value) {
  return ethers.utils.hexValue(value)
}

function arrayify(value) {
  return ethers.utils.arrayify(value)
}

function hexlify(value) {
  return ethers.utils.hexlify(value)
}

function encodeABI(types, values) {
  return ethers.utils.defaultAbiCoder.encode(types, values)
}

function decodeABI(types, data) {
  return ethers.utils.defaultAbiCoder.decode(types, data)
}

function createBigNumber(value): ethers.BigNumber {
  return BigNumber.from(value)
}

export const ether = {
  createWallet,
  generateMnemonic,
  getBalance,
  getContractBalance,
  getGasPrice,
  getNonce,
  signTransaction,
  sendTransaction,
  contractTransaction,
  waitForContractTransaction,
  waitForTransaction,
  importMnemonic,

  bigNumberFormatUnits,
  bigNumberParseUnits,
  getEventNameID,
  hexZeroPad,
  hexString,
  arrayify,
  hexlify,
  encodeABI,
  decodeABI,
  createBigNumber,
}

export type Ether = keyof typeof ether
