import React, { FC, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native"
import { Button, Screen, Text } from "../../../components"
import { translate } from "../../../i18n"
import { AppStackScreenProps } from "../../../navigators"
import { colors } from "../../../theme"
import { useIsMounted } from "../../../utils/useIsMounted"
import { web3 } from "../../../utils/web3"
import { Menemonic } from "../../../utils/web3/ether/ether.types"

import Clipboard from "@react-native-clipboard/clipboard"
import Toast from "react-native-simple-toast"

export const GenerateSecretPhraseSreen: FC<AppStackScreenProps<"GenerateSecretPhrase">> = ({
  navigation,
}) => {
  // hooks
  const isMounted = useIsMounted()

  // states
  const _mnemonic = useState<Menemonic>()
  const _mnemonicHeight = useState<number>(0)

  // effects
  useEffect(() => {
    if (isMounted() && !_mnemonic[0]) {
      _mnemonic[1](web3.ether.generateMnemonic())
    }
  }, [_mnemonic[0]])

  // memos
  const mnemonicList = useMemo(
    () =>
      !_mnemonic[0] ? null : (
        <MnemonicTexts heightCallback={_mnemonicHeight[1]} mnemonic={_mnemonic[0].mnemonic} />
      ),
    [_mnemonic[0]],
  )

  // functions
  const handleCopy = () => {
    Clipboard.setString(_mnemonic[0].mnemonic.join(" "))
    Toast.show(translate("common.copied"), Toast.SHORT)
  }

  const handleContinue = () => {
    navigation.navigate("VerifySecretPhrase", {
      mnemonic: _mnemonic[0],
      mnemonicHeight: _mnemonicHeight[0],
    })
  }

  return (
    <Screen preset="fixed" contentContainerStyle="flex-1" safeAreaEdges={["bottom"]}>
      <View className="items-center px-6">
        <Text
          className="text-2xl font-family-semi-bold"
          tx="createNewWallet.generateSecretPhrare"
        />
        <Text
          className="mt-2 text-center text-gray-500 leading-6"
          tx="createNewWallet.generateSecretPhrareHint"
        />
      </View>

      <View className="p-6 flex-auto">
        {!Boolean(_mnemonic[0]) ? (
          <ActivityIndicator color={colors.black} />
        ) : (
          <>
            {mnemonicList}

            <Button
              preset="clear"
              textStyle="text-primary-500"
              tx="common.copy"
              onPress={handleCopy}
              className="mt-4"
            />
          </>
        )}
      </View>
      <View className="m-6 p-6 bg-red-100 rounded-lg">
        <Text className="text-red-900" tx="createNewWallet.secretSpecialHint" />
      </View>
      <Button
        preset="filled"
        tx="common.continue"
        className="mx-6"
        disabled={!Boolean(_mnemonic[0])}
        onPress={handleContinue}
      />
    </Screen>
  )
}

interface MnemonicTextsProps {
  mnemonic: string[]
  heightCallback?: (h: number) => void
  onPick?: (word: string) => void
  disabled?: boolean
}

export function MnemonicTexts(props: MnemonicTextsProps) {
  const { mnemonic, heightCallback, onPick, ...rest } = props

  return (
    <View
      className="flex-row flex-wrap items-center justify-center"
      onLayout={(e) => heightCallback && heightCallback(e.nativeEvent.layout.height)}
    >
      {mnemonic.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onPick(item)}
          disabled={rest.disabled || !Boolean(onPick)}
        >
          <View className="bg-white flex-row items-center border-[0.5px] border-gray-300 rounded-md px-2 py-1 mx-1 mb-2">
            <Text>
              <Text className="text-gray-400">{index + 1}</Text> {item}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}
