import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, Divider, Screen, Text } from "../../components"
import { SendStackScreenProps } from "../../navigators/SendStack"
import { useHeaderOption } from "../../utils/useHeader"
import { colors } from "../../theme"
import { View } from "react-native"
import { useStores } from "../../models"
import { useKeychain } from "../../hooks"
import { useMount } from "../../utils/useIsMounted"
import { Buffer } from "buffer"
import { Erc20Abi } from "../../abis"
import { getAddressByChain } from "../../utils/common"
import { web3 } from "../../utils/web3"
import { ethers } from "ethers"

import BigNumber from "bignumber.js"
import i18n from "i18n-js"
import Config from "../../config"

export const SendConfirmationScreen: FC<SendStackScreenProps<"SendConfirmation">> = observer(
  function ({ route, navigation }) {
    // store
    const rootStore = useStores()
    const activeWallet = rootStore.walletStore.activeWallet

    // hooks
    const keychain = useKeychain({
      service: activeWallet.id,
      needHash: false,
    })

    const keystore = keychain.data.username

    // navigators
    const { currency, data } = route.params
    const { address } = getAddressByChain(currency.chain, activeWallet.addresses)
    const currencyWallet = rootStore.walletStore.getBalanceByCurrencyId(currency.id)
    const nativeCurrencyWallet = rootStore.walletStore.getBalanceByCurrencyId("ethereum")
    useHeaderOption({
      titleTx: "navigators.screenName.sendConfirmation",
      headerTintColor: colors.white,
      headerStyle: { backgroundColor: colors.primary[500] },
    })

    // states
    const _loading = useState<boolean>(true)
    const _gasLimit = useState<ethers.BigNumber>(() => web3.ether.createBigNumber(100000))
    const _gasPrice = useState<ethers.BigNumber>()

    // variables
    const currencyAmount = i18n.toCurrency(Number(data.amount), {
      unit: "",
      precision: currency.decimals,
      strip_insignificant_zeros: true,
    })
    const rawFiatAmount = new BigNumber(data.amount).multipliedBy(currencyWallet.exchangeRate)
    const fiatAmount = i18n.toCurrency(Number(rawFiatAmount), {
      unit: "",
      precision: 8,
      strip_insignificant_zeros: true,
    })
    const fee =
      _gasPrice[0] && _gasLimit[0]
        ? web3.ether.bigNumberFormatUnits(_gasPrice[0].mul(_gasLimit[0]))
        : web3.ether.createBigNumber(0)
    const rawFiatFee = fee.mul(nativeCurrencyWallet.exchangeRate).toString()
    const fiatFee = i18n.toCurrency(Number(rawFiatFee), {
      unit: "",
      precision: 8,
      strip_insignificant_zeros: true,
    })
    const maxTotal = i18n.toCurrency(
      Number(new BigNumber(rawFiatAmount).minus(rawFiatFee).toString()),
      {
        unit: "",
        precision: 8,
        strip_insignificant_zeros: true,
      },
    )

    // functions
    const getGasPrice = async () => {
      const response = await web3.ether.getGasPrice({ network: Config.network })
      return response
    }
    const getNonce = async () => {
      const response = await web3.ether.getNonce({ network: Config.network, address })
      return response
    }

    const createTxn = async () => {
      _loading[1](true)
      const gasPrice = await getGasPrice()
      const nonce = await getNonce()

      if (currency.contractAddress) {
        createTxnForNonETH({ gasPrice, nonce })
      } else {
        const signedTx = await web3.ether.signTransaction({
          keystore,
          password: "",
          nonce,
          gasLimit: _gasLimit[0],
          gasPrice,
          toAddress: data.address,
          chainId: Config.chainId,
          amount: data.amount + "",
          data:
            "0x" +
            Buffer.from(`sparkminds.net---send ${data.amount} ${currency.shortName}`).toString(
              "hex",
            ),
        })
        if (signedTx) {
          const tx = await web3.ether.sendTransaction({
            network: Config.network,
            signedTransaction: signedTx,
          })

          if (tx) {
            navigation.replace("SendResult", {
              tx,
              currency,
            })
          }
        }
        _loading[1](false)
      }
    }

    const createTxnForNonETH = async ({ nonce, gasPrice }) => {
      const tx = await web3.ether.contractTransaction({
        network: Config.network,
        contractAddress: currency.contractAddress,
        contractAbi: Erc20Abi,
        keystore,
        password: "",
        nonce,
        gasLimit: _gasLimit[0],
        gasPrice,
        toAddress: data.address,
        amount: data.amount + "",
        decims: currency.decimals,
      })

      if (tx) {
        navigation.replace("SendResult", { tx, currency })
      }
      _loading[1](false)
    }

    const boostrapAsync = async () => {
      _loading[1](true)
      _gasPrice[1](await getGasPrice())
      _loading[1](false)
    }

    useMount(() => {
      boostrapAsync()
    })

    return (
      <Screen
        preset="fixed"
        contentContainerStyle="flex-auto"
        backgroundColor={colors.background}
        safeAreaEdges={["bottom"]}
      >
        <View className="flex-auto">
          <View className="py-8 px-1 items-center">
            <Text>
              <Text className="text-2xl">
                -{currencyAmount} {currency.shortName}
              </Text>
              <Text className="text-primary-500">
                {` ≈ `}
                US${fiatAmount}
              </Text>
            </Text>
          </View>
          <Divider />
          <View className="p-6">
            <Text tx="common.from" />
            <Text numberOfLines={1} ellipsizeMode="middle" className="text-sm text-gray-500 mt-1">
              {address}
            </Text>
          </View>
          <Divider />
          <View className="p-6">
            <Text tx="common.to" />
            <Text numberOfLines={1} ellipsizeMode="middle" className="text-sm text-gray-500 mt-1">
              {data.address}
            </Text>
          </View>
          <Divider />
          <View className="p-6 flex-row">
            <Text className="flex-auto" tx="trade.networkFee" />
            <Text className="text-gray-500 text-right">
              {fee} ETH
              {"\n"}(US${fiatFee})
            </Text>
          </View>
          <Divider />
          <View className="p-6 flex-row">
            <Text className="flex-auto" tx="trade.maxTotal" />
            <Text>US${maxTotal}</Text>
          </View>
        </View>
        <Button
          preset="filled"
          className="mx-6"
          tx="common.send"
          loading={_loading[0]}
          disabled={_loading[0]}
          onPress={createTxn}
        />
      </Screen>
    )
  },
)
