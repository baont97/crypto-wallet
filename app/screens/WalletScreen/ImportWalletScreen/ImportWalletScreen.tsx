import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, Screen, Text, TextField } from "../../../components"
import { Alert, View } from "react-native"
import { useFormik } from "formik"
import { ImportWalletModel } from "../CreateWalletScreen.types"
import { useStores } from "../../../models"
import { importMnemonic } from "react-native-web3-wallet"
import { capitalize, getFormErrorMessage, getRandomId, getRandomName } from "../../../utils/string"
import { colors } from "../../../theme"
import { AppStackScreenProps } from "../../../navigators"

import Clipboard from "@react-native-clipboard/clipboard"
import * as yup from "yup"
import { useKeychain } from "../../../hooks"

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
    onSubmit: function (values) {
      _isImporting[1](true)
      importMnemonic(values.mnemonic, "")
        .then(async (res) => {
          const id = getRandomId()

          await keychain.save({
            service: id,
            password: JSON.stringify(res.keystore),
            dateTime: new Date().toISOString(),
          })

          rootStore.walletStore.updateWalletList(
            { id, name: values.walletName, address: res.address },
            "add",
          )
        })
        .catch(() => {
          Alert.alert(getFormErrorMessage("input.secretPhrase.label", "invalid"))
        })
        .finally(() => {
          _isImporting[1](false)
        })
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
