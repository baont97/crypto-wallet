import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, Screen, Text, TextField } from "../../../components"
import { Alert, View } from "react-native"
import { useFormik } from "formik"
import { ImportWalletModel } from "../CreateWalletScreen.types"
import { AddressModel, useStores } from "../../../models"
import { capitalize, getFormErrorMessage, getRandomId, getRandomName } from "../../../utils/string"
import { colors } from "../../../theme"
import { AppStackScreenProps } from "../../../navigators"
import { useKeychain } from "../../../hooks"
import { SUPPORTED_CHAINS, WALLET_PATHS } from "../../../config/contants"
import { IMSTArray, _NotCustomized } from "mobx-state-tree"

import Clipboard from "@react-native-clipboard/clipboard"
import * as yup from "yup"
import { web3 } from "../../../utils/web3"

export const ImportWalletScreen: FC<AppStackScreenProps<"ImportWallet">> = observer(function ({
  route,
}) {
  // hooks
  const rootStore = useStores()
  const keychain = useKeychain({
    service: "NONE",
    needHash: false,
  })

  // states
  const _isImporting = useState<boolean>(false)

  // form
  const formik = useFormik<ImportWalletModel>({
    initialValues: {
      walletName: capitalize(getRandomName()),
      mnemonic: "",
    },
    onSubmit: async function (values) {
      _isImporting[1](true)
      const ethWallet = await web3.ether.importMnemonic({
        mnemonic: values.mnemonic,
        password: "",
        path: WALLET_PATHS.ETH,
      })

      const btcWallet = await web3.ether.importMnemonic({
        mnemonic: values.mnemonic,
        password: "",
        path: WALLET_PATHS.BTC,
      })

      if (ethWallet && btcWallet) {
        const id = getRandomId()

        await keychain.save({
          service: id,
          password:
            JSON.stringify(ethWallet.keystore) +
            "[sparkminds]" +
            JSON.stringify(btcWallet.keystore),
          dateTime: new Date().toISOString(),
        })

        rootStore.walletStore.updateWalletList(
          {
            id,
            name: values.walletName,
            addresses: [
              {
                id: getRandomId() as string,
                address: ethWallet.address,
                chain: SUPPORTED_CHAINS.ETH,
              },
              {
                id: getRandomId() as string,
                address: btcWallet.address,
                chain: SUPPORTED_CHAINS.BTC,
              },
            ] as IMSTArray<typeof AddressModel>,
          },
          "add",
        )
      } else {
        Alert.alert(getFormErrorMessage("input.secretPhrase.label", "invalid"))
      }
      _isImporting[1](false)

      // web3.ether
      //   .importMnemonic({
      //     mnemonic: values.mnemonic,
      //     password: "",
      //     path: WALLET_PATHS.ETH,
      //   })
      //   .then(async (res) => {
      //     const id = getRandomId()

      //     await keychain.save({
      //       service: id,
      //       password: JSON.stringify(res.keystore),
      //       dateTime: new Date().toISOString(),
      //     })

      //     rootStore.walletStore.updateWalletList(
      //       {
      //         id,
      //         name: values.walletName,
      //         addresses: [
      //           {
      //             id: getRandomId() as string,
      //             chain: SUPPORTED_CHAINS.ETH,
      //             address: res.address,
      //           },
      //           {
      //             id: getRandomId() as string,
      //             chain: SUPPORTED_CHAINS.BTC,
      //             // temporary
      //             address: getRandomId(),
      //           },
      //         ] as IMSTArray<typeof AddressModel>,
      //       },
      //       "add",
      //     )
      //   })
      //   .catch(() => {
      //     Alert.alert(getFormErrorMessage("input.secretPhrase.label", "invalid"))
      //   })
      //   .finally(() => {
      //     _isImporting[1](false)
      //   })
    },
    validationSchema: yup.object().shape({
      walletName: yup
        .string()
        .required(getFormErrorMessage("input.walletName.label", "required"))
        .nullable(),
      mnemonic: yup
        .string()
        .required(getFormErrorMessage("input.secretPhrase.label", "invalid"))
        .nullable(),
    }),
  })

  const { values, handleChange, setFieldValue, validateForm, handleSubmit } = formik

  // functions
  const handlePasteFromClipboard = async () => {
    const clipboard = await Clipboard.getString()
    setFieldValue("mnemonic", clipboard)
  }

  const _handleSubmit = async () => {
    const errors = await validateForm()

    if (Object.keys(errors).length) {
      Alert.alert(errors.mnemonic || errors.walletName)
    } else {
      handleSubmit()
    }
  }

  return (
    <Screen
      preset="scroll"
      contentContainerStyle="flex-auto px-6 pt-6"
      safeAreaEdges={["bottom"]}
      backgroundColor={colors.background}
    >
      <View className="flex-auto">
        <TextField
          containerStyle="mb-6"
          inputContainerStyle="bg-white rounded-lg px-6 py-2"
          className="mx-0 text-black"
          inputWrapperStyle="bg-transparent border-0"
          labelTx="input.walletName.label"
          placeholderTx="input.walletName.placeholder"
          LabelTextProps={{ className: "text-sm text-gray-400", style: { marginBottom: 0 } }}
          value={values.walletName}
          onChangeText={handleChange("walletName")}
        />

        <View>
          <TextField
            inputContainerStyle="bg-white rounded-lg px-6 py-2 h-[25vh]"
            className="mx-0 text-black"
            inputWrapperStyle="bg-transparent border-0"
            placeholderTx="input.secretPhrase.placeholder"
            multiline
            value={values.mnemonic}
            onChangeText={handleChange("mnemonic")}
          />

          <Button
            preset="clear"
            tx="common.paste"
            className="absolute right-0 bottom-0 px-4 py-0 min-h-[4vh]"
            textStyle="text-primary-500 font-family-semi-bold"
            onPress={handlePasteFromClipboard}
          />
        </View>

        <Text className="text-sm text-gray-500 mx-6 my-2" tx="importWallet.hint" />
      </View>

      <Button
        preset="filled"
        tx="common.import"
        onPress={_handleSubmit}
        loading={_isImporting[0]}
      />
    </Screen>
  )
})
