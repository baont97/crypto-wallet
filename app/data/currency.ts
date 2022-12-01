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
  },
  {
    id: "uniswap",
    name: "Uniswap",
    shortName: "UNI",
    contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
    priceChangePercentage24h: 0,
  },
  {
    id: "dai",
    name: "DAI",
    shortName: "DAI",
    contractAddress: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
    decimals: 18,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
    priceChangePercentage24h: 0,
  },
  {
    id: "force-bridge-fiatc",
    name: "Force Bridge USDC",
    shortName: "USDC",
    contractAddress: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    decimals: 6,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    priceChangePercentage24h: 0,
  },
  {
    id: "chainlink",
    name: "Chainlink",
    shortName: "LINK",
    contractAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    decimals: 18,
    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
    priceChangePercentage24h: 0,
  },
]
