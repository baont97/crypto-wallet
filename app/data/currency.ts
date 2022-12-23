import { SUPPORTED_CHAINS } from "../config/contants"
import { Currency } from "../models/currency/CurrencyStore.models"

/**
 * Currency base on api from Coingecko API
 * https://api.coingecko.com/api/v3/coins/list
 */
export const Currencies: Currency[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    shortName: "ETH",
    decimals: 18,
    contractAddress: "",
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    priceChangePercentage24h: 0,
    chain: SUPPORTED_CHAINS.ETH,
  },
  {
    id: "uniswap",
    name: "Uniswap",
    shortName: "UNI",
    contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
    priceChangePercentage24h: 0,
    chain: SUPPORTED_CHAINS.ETH,
  },
  {
    id: "dai",
    name: "DAI",
    shortName: "DAI",
    contractAddress: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
    decimals: 18,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
    priceChangePercentage24h: 0,
    chain: SUPPORTED_CHAINS.ETH,
  },
  {
    id: "force-bridge-fiatc",
    name: "Force Bridge USDC",
    shortName: "USDC",
    contractAddress: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    decimals: 6,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    priceChangePercentage24h: 0,
    chain: SUPPORTED_CHAINS.ETH,
  },
  {
    id: "chainlink",
    name: "Chainlink",
    shortName: "LINK",
    contractAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    decimals: 18,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
    priceChangePercentage24h: 0,
    chain: SUPPORTED_CHAINS.ETH,
  },
  {
    id: "tether",
    name: "Tether",
    shortName: "USDT",
    contractAddress: "0x509Ee0d083DdF8AC028f2a56731412edD63223B9",
    decimals: 18,
    image:
      "https://pancakeswap.finance/images/tokens/0x55d398326f99059fF775485246999027B3197955.png",
    priceChangePercentage24h: 0,
    chain: SUPPORTED_CHAINS.ETH,
  },
  {
    id: "weth",
    name: "WETH",
    shortName: "WETH",
    contractAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    decimals: 18,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png",
    priceChangePercentage24h: 0,
    chain: SUPPORTED_CHAINS.ETH,
  },
  {
    id: "wrapped-bitcoin",
    name: "Wrapped Bitcoin",
    shortName: "WBTC",
    contractAddress: "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
    decimals: 18,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
    priceChangePercentage24h: 0,
    chain: SUPPORTED_CHAINS.ETH,
  },
]
