import { useCallback, useEffect } from "react"
import { Balance, Currency, useStores } from "../../models"
import { Erc20Abi } from "../../abis"
import { MarketPrice } from "./balance.types"
import { web3 } from "../../utils/web3"
import { getAddressByChain } from "../../utils/common"

import BigNumber from "bignumber.js"
import Config from "../../config"
import { useFocusEffect } from "@react-navigation/native"

interface CustomBalance extends Balance {
  priceChangePercentage24h: number
}

export const useBalance = () => {
  const rootStore = useStores()
  const activeWallet = rootStore.walletStore.activeWallet
  const currencies = rootStore.currencyStore.activeCurrencies
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
    const { address } = getAddressByChain(currency.chain, activeWallet.addresses)

    const response = !currency.contractAddress
      ? await web3.ether.getBalance({
          network: Config.network,
          address,
        })
      : await web3.ether.getContractBalance({
          network: Config.network,
          contractAddress: currency.contractAddress,
          contractAbi: Erc20Abi,
          address,
        })

    if (!response) {
      return {
        currencyId: currency.id,
        native: 0,
        fiat: 0,
        exchangeRate: 1,
        priceChangePercentage24h: 0,
      }
    } else {
      const balance = Number(web3.ether.bigNumberFormatUnits(response, currency.decimals))
      const market = await fetchMartket(currency.id)

      const exchangeRate = market?.current_price || 0
      const priceChangePercentage24h = market?.price_change_percentage_24h || 0

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
    if (!activeWallet?.id) return

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

      rootStore.currencyStore.setProp(
        "customCurrencies",
        rootStore.currencyStore.customCurrencies.map((item) => ({
          ...item,
          priceChangePercentage24h:
            response.find((_item) => _item.currencyId === item.id)?.priceChangePercentage24h || 0,
        })),
      )
    })
  }

  useFocusEffect(
    useCallback(() => {
      boostrapAsync()
    }, []),
  )
}
