// import BIP32Factory from "bip32"
// import ECPairFactory from "ecpair"
// import * as bip39 from "bip39"
// import * as ecc from "tiny-secp256k1"
// import { randomBytes as _randomBytes } from "crypto"

// const bip32 = BIP32Factory(ecc)
// const ECPair = ECPairFactory(ecc)
// export const bitcoin = require("bitcoinjs-lib")

// /**
//  *
//  *
//  * @export
//  * @param {string} password
//  * @param {string} [path="m/44'/0'/0'/0/0"]
//  * @param {number} [seedByte=16]
//  * @param {boolean} [needPrivateKey=false]
//  * @param {boolean} [needPublicKey=false]
//  * @param {boolean} [needWIF=true]
//  * @param {boolean} [needXpriv=false]
//  * @param {boolean} [needXpub=false]
//  * @param {bitcoin.networks.Network} network
//  * @return {Promise<{address:'',mnemonic:[],WIF:'',xpriv:'',xpub:'',shuffleMnemonic:[],publicKey:'',privateKey:''}>}
//  */
// export function createWallet(
//   password,
//   path = "m/44'/0'/0'/0/0",
//   seedByte = 16,
//   network = bitcoin.networks.bitcoin,
//   needPrivateKey = false,
//   needPublicKey = false,
//   needXpriv = false,
//   needXpub = false,
//   needWIF = true,
// ) {
//   return new Promise((fulfill, reject) => {
//     try {
//       //16-12words 20-15words 24-18words 28-21words 32-24words
//       let privateSeed = _randomBytes(seedByte)
//       //2048 words
//       let mnemonic = bip39.entropyToMnemonic(privateSeed)

//       password = password ? password : ""

//       let seed = bip39.mnemonicToSeedSync(mnemonic, password)
//       let node = bip32.fromSeed(seed)

//       let hdnode = node.derivePath(path)

//       let mnemonicArr = mnemonic.split(" ")
//       let shuffleMnemonicArr = shuffled(mnemonicArr)

//       let bitcoinAddress = getBitcoinAddress(
//         hdnode,
//         network,
//         path.match(/(?<=\/)(\d*)/g)[0].toNumber(),
//       )
//       let response = {
//         mnemonic: mnemonicArr,
//         shuffleMnemonic: shuffleMnemonicArr,
//         address: bitcoinAddress,
//       }
//       if (needPublicKey) {
//         response.publicKey = hdnode.publicKey.toString("hex")
//       }
//       if (needPrivateKey) {
//         response.privateKey = hdnode.privateKey.toString("hex")
//       }
//       if (needXpriv) {
//         response.xpriv = hdnode.toBase58()
//       }
//       if (needXpub) {
//         response.xpub = hdnode.neutered().toBase58()
//       }
//       if (needWIF) {
//         response.WIF = hdnode.toWIF()
//       }
//       fulfill(response)
//     } catch (error) {
//       reject(error)
//     }
//   })
// }
