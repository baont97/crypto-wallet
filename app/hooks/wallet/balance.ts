import { useEffect } from "react"
import { Balance, Currency, useStores } from "../../models"
import { Erc20Abi } from "../../abis"
import { MarketPrice } from "./balance.types"

import * as Web3Wallet from "react-native-web3-wallet"
import BigNumber from "bignumber.js"
import Config from "../../config"

interface CustomBalance extends Balance {
  priceChangePercentage24h: number
}

export const useBalance = () => {
  const rootStore = useStores()
  const activeWallet = rootStore.walletStore.activeWallet
  const currencies = rootStore.currencyStore.currencies
  const unit = "usd"

  /**
   *
   * @param token
   * @returns rate that convert currency to usd
   */
  const fetchMartket = async (currencyId: string): Promise<MarketPrice> => {
    let response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${unit}&ids=${currencyId}`,
    )
    const result = await response.json()

    return result?.[0]
  }

  /**
   *
   * @param token
   * @returns return balance of token
   */
  const fetchBalance = async (currency: Currency): Promise<CustomBalance> => {
    const response = !currency.contractAddress
      ? await Web3Wallet.getBalance(Config.network, activeWallet.address)
      : await Web3Wallet.getContractBalance(
          Config.network,
          currency.contractAddress,
          Erc20Abi,
          activeWallet.address,
        )

    if (!response) {
      return {
        currencyId: currency.id,
        native: 0,
        fiat: 0,
        exchangeRate: 1,
        priceChangePercentage24h: 0,
      }
    } else {
      const balance = Number(Web3Wallet.bigNumberFormatUnits(response, currency.decimals))
      const { current_price: exchangeRate, price_change_percentage_24h: priceChangePercentage24h } =
        (await fetchMartket(currency.id)) || { current_price: 0, price_change_24h: 0 }

      return {
        currencyId: currency.id,
        native: balance,
        fiat: Number(new BigNumber(balance).multipliedBy(exchangeRate)),
        exchangeRate,
        priceChangePercentage24h,
      }
    }
  }

  const boostrapAsync = async () => {
    const promises = currencies.map((x) => fetchBalance(x))
    Promise.all(promises).then((response) => {
      rootStore.walletStore.setProp("balances", response)
      rootStore.currencyStore.setProp(
        "currencies",
        rootStore.currencyStore.currencies.map((item) => ({
          ...item,
          priceChangePercentage24h:
            response.find((_item) => _item.currencyId === item.id)?.priceChangePercentage24h || 0,
        })),
      )
    })
  }

  useEffect(() => {
    if (activeWallet?.id) {
      boostrapAsync()
    }
  }, [activeWallet?.id])
}
