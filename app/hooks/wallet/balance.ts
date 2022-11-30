import { useEffect } from "react"
import * as Web3Wallet from "react-native-web3-wallet"
import { Balance, Currency, useStores } from "../../models"
import { Erc20Abi } from "../../abis"

import BigNumber from "bignumber.js"
import i18n from "i18n-js"
import Config from "../../config"

export const useBalance = () => {
  const rootStore = useStores()
  const activeWallet = rootStore.walletStore.activeWallet
  const currencies = rootStore.currencyStore.currencies
  // const unit = i18n.currentLocale().includes("vi") ? "vnd" : "usd"
  const unit = "usd"

  /**
   *
   * @param token
   * @returns rate that convert currency to usd
   */
  const fetchExchangeRate = async (currencyId: string): Promise<number> => {
    let response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${currencyId}&vs_currencies=${unit}`,
    )
    const result = await response.json()

    return result?.[currencyId]?.[unit] | 1
  }

  /**
   *
   * @param token
   * @returns return balance of token
   */
  const fetchBalance = async (currency: Currency): Promise<Balance> => {
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
      }
    } else {
      const balance = Number(Web3Wallet.bigNumberFormatUnits(response, currency.decimals))
      const exchangeRate = await fetchExchangeRate(currency.id)

      return {
        currencyId: currency.id,
        native: balance,
        fiat: Number(new BigNumber(balance).multipliedBy(exchangeRate)),
      }
    }
  }

  const boostrapAsync = async () => {
    const promises = currencies.map((x) => fetchBalance(x))
    Promise.all(promises).then((response) => {
      rootStore.walletStore.setProp("balances", response)
    })
  }

  useEffect(() => {
    if (activeWallet?.id) {
      boostrapAsync()
    }
  }, [activeWallet?.id])
}
