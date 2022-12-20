import { observer } from "mobx-react-lite"
import { IMSTArray } from "mobx-state-tree"
import React, { FC, useMemo, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { Button, Icon, Screen, Text } from "../../../components"
import { SUPPORTED_CHAINS } from "../../../config/contants"
import { useKeychain } from "../../../hooks"
import { translate } from "../../../i18n"
import { AddressModel, useStores } from "../../../models"
import { AppStackScreenProps } from "../../../navigators"
import { colors, spacing } from "../../../theme"
import { getRandomId, getRandomName } from "../../../utils/string"
import { web3 } from "../../../utils/web3"
import { MnemonicTexts } from "./GenerateSecretPhraseScreen"

export const VerifySecretPhraseScreen: FC<AppStackScreenProps<"VerifySecretPhrase">> = observer(
  function ({ route }) {
    // hooks
    const rootStore = useStores()
    const keychain = useKeychain({
      service: "NONE",
      needHash: false,
    })

    // navigators
    const mnemonicHeight = route.params.mnemonicHeight
    const { mnemonic, shuffledMnemonic } = route.params.mnemonic

    // states
    const _mnemonicPicking = useState<string[]>(__DEV__ ? mnemonic : [])
    const _loading = useState<boolean>(false)

    // functions
    const handleMnemonicItemPick = (input: string) => {
      _mnemonicPicking[1]((prev) => {
        if (prev.includes(input)) {
          return prev.filter((item) => item !== input)
        } else {
          return prev.concat([input])
        }
      })
    }

    const handleSubmit = async () => {
      const wallet = await web3.ether.createWallet({
        mnemonic: mnemonic.join(" "),
        mnemonicPassword: "",
        password: "",
      })

      const id = getRandomId()

      await keychain.save({
        service: id,
        password: JSON.stringify(wallet.keystore),
        dateTime: new Date().toISOString(),
      })

      let walletName = getRandomName()

      if (!rootStore.walletStore.wallets.length) {
        walletName = translate("common.mainWallet")
      }

      rootStore.walletStore.updateWalletList(
        {
          id,
          name: walletName,
          addresses: [
            {
              id: getRandomId(),
              address: wallet.address,
              chain: SUPPORTED_CHAINS.ETH,
            },
            {
              id: getRandomId(),
              address: "",
              chain: SUPPORTED_CHAINS.BTC,
            },
          ] as IMSTArray<typeof AddressModel>,
        },
        "add",
      )
    }

    // memos
    const isWrongOrder = useMemo(() => {
      const pickingAsString = _mnemonicPicking[0].join("")
      const originalAsString = mnemonic.join("")

      return originalAsString.slice(0, pickingAsString.length) !== pickingAsString
    }, [_mnemonicPicking[0], mnemonic])
    const mnemonicList = useMemo(
      () => <MnemonicTexts mnemonic={_mnemonicPicking[0]} onPick={handleMnemonicItemPick} />,
      [_mnemonicPicking[0], handleMnemonicItemPick],
    )
    const suffleMnemonicList = useMemo(
      () => (
        <SuffleMnemonicTexts
          mnemonic={shuffledMnemonic}
          pickingMnemonic={_mnemonicPicking[0]}
          onPick={handleMnemonicItemPick}
          disabled={isWrongOrder}
        />
      ),
      [shuffledMnemonic, _mnemonicPicking[0], handleMnemonicItemPick],
    )

    return (
      <Screen preset="fixed" contentContainerStyle="flex-1" safeAreaEdges={["bottom"]}>
        <View className="items-center px-6">
          <Text
            className="text-2xl font-family-semi-bold"
            tx="createNewWallet.verifySecretPhrase"
          />
          <Text
            className="mt-2 text-center text-gray-500 leading-6"
            tx="createNewWallet.verifySecretPhraseHint"
          />
        </View>

        <View className="flex-auto">
          <View className="bg-gray-50 mt-6 items-center justify-center p-6 border-t-[0.25px] border-b-[0.25px] border-t-gray-300 border-b-gray-300">
            <View style={{ minHeight: mnemonicHeight }}>{mnemonicList}</View>
            {isWrongOrder ? (
              <View className="flex-row items-center">
                <Icon icon="clap" size={spacing.medium} color={colors.red[700]} />
                <Text className="ml-1 text-red-700" tx="errorMessage.mnemonicWrongOrder" />
              </View>
            ) : null}
          </View>
          <View className="p-6">{suffleMnemonicList}</View>
        </View>
        <Button
          preset="filled"
          tx="common.continue"
          className="mx-6"
          disabled={_loading[0] || isWrongOrder || _mnemonicPicking[0].length !== mnemonic.length}
          onPress={handleSubmit}
          loading={_loading[0]}
        />
      </Screen>
    )
  },
)

interface SuffleMnemonicTextsProps {
  mnemonic: string[]
  pickingMnemonic: string[]
  onPick: (word: string) => void
  disabled?: boolean
}

function SuffleMnemonicTexts(props: SuffleMnemonicTextsProps) {
  const { mnemonic, pickingMnemonic, onPick, ...rest } = props

  return (
    <View className="flex-row flex-wrap items-center justify-center">
      {mnemonic.map((item, index) => {
        const isPicking = pickingMnemonic.includes(item)

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onPick(item)}
            disabled={rest.disabled || isPicking}
          >
            <View
              className={`flex-row items-center border-[0.5px] border-gray-300 rounded-md px-2 py-1 mx-1 mb-2 ${
                !isPicking ? "" : "border-dashed"
              }`}
            >
              <Text className={`opacity-${isPicking ? "0" : "1"}`}>{item}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
