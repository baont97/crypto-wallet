import React, { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, Divider, Screen, Text } from "../../components"
import { SendStackScreenProps } from "../../navigators/SendStack"
import { useHeaderOption } from "../../utils/useHeader"
import { colors } from "../../theme"
import { View } from "react-native"
import { Erc20Abi } from "../../abis"
import { ethers } from "ethers"

import * as Web3Wallet from "react-native-web3-wallet"
import { useMount } from "../../utils/useIsMounted"
import Config from "../../config"

export const SendResultScreen: FC<SendStackScreenProps<"SendResult">> = observer(function ({
  route,
  navigation,
}) {
  // navigators
  const { currency, tx } = route.params
  useHeaderOption({
    titleTx: "navigators.screenName.sendConfirmation",
    headerTintColor: colors.white,
    headerStyle: { backgroundColor: colors.primary[500] },
  })

  // states
  const _txReceipt = useState<ethers.providers.TransactionReceipt>()

  // memos
  const value = useMemo(() => {
    const iface = new ethers.utils.Interface(Erc20Abi)
    let decodedData = iface.parseTransaction({ data: tx.data, value: tx.value })

    return Web3Wallet.bigNumberFormatUnits(decodedData.args[1])
  }, [tx])

  // functions
  const boostrapAsync = async () => {
    const txReceipt = currency.contractAddress
      ? await Web3Wallet.waitForContractTransaction(tx)
      : await Web3Wallet.waitForTransaction(Config.network, tx.hash)
    _txReceipt[1](txReceipt)
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
        <View className="p-6">
          <Text
            className="text-2xl mb-2"
            tx="sendResult.information.title"
            txOptions={{ token: currency.shortName }}
          />
          <Divider />
          <View className="py-2 flex-row items-center justify-between">
            <Text tx="sendResult.information.value" />
            <Text>
              {value} {currency.shortName}
            </Text>
          </View>
          <Divider />
          <View className="py-2 flex-row items-center justify-between">
            <Text tx="sendResult.information.to" />
            <Text className="flex-1 pl-6 text-right" numberOfLines={1} ellipsizeMode="middle">
              {tx.to}
            </Text>
          </View>
          <Divider />
          {!_txReceipt[0] ? null : (
            <>
              <View className="py-2 flex-row items-center justify-between">
                <Text tx="sendResult.information.txnFee" />
                <Text>
                  {Web3Wallet.bigNumberFormatUnits(
                    _txReceipt[0].gasUsed.mul(_txReceipt[0].effectiveGasPrice),
                    currency.decimals,
                  )}{" "}
                  ETH
                </Text>
              </View>
              <Divider />
            </>
          )}
          {!_txReceipt[0] ? null : (
            <>
              <View className="py-2 flex-row items-center justify-between">
                <Text tx="sendResult.information.confirmations" />
                <Text className="pl-6" numberOfLines={1} ellipsizeMode="middle">
                  {_txReceipt[0].confirmations}
                </Text>
              </View>
              <Divider />
            </>
          )}
          <View className="py-2 flex-row items-center justify-between">
            <Text tx="sendResult.information.txnHash" />
            <Text
              selectable
              className="flex-1 pl-6 text-right"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {tx.hash}
            </Text>
          </View>
          <Divider />
        </View>
      </View>
      <Button preset="filled" className="mx-6" tx="common.done" onPress={navigation.goBack} />
    </Screen>
  )
})
