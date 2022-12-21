import React, { FC, useEffect, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { Button, Icon, Screen, Text, TextField } from "../../components"
import { SendStackScreenProps } from "../../navigators/SendStack"
import { useHeaderOption } from "../../utils/useHeader"
import { translate } from "../../i18n"
import { colors, spacing, typography } from "../../theme"
import { Alert, TouchableOpacity, View } from "react-native"
import { useFormik } from "formik"
import { SendModel } from "./SendScreen.types"
import { useStores } from "../../models"
import { getFormErrorMessage } from "../../utils/string"
import { getAddressByChain } from "../../utils/common"

import Clipboard from "@react-native-clipboard/clipboard"
import BigNumber from "bignumber.js"
import * as yup from "yup"

export const SendScreen: FC<SendStackScreenProps<"Send">> = observer(function ({
  route,
  navigation,
}) {
  // store
  const rootStore = useStores()
  const activeWallet = rootStore.walletStore.activeWallet

  // navigators
  const currency = route.params.currency
  const currencyWallet = rootStore.walletStore.getBalanceByCurrencyId(currency.id)

  // form
  const formik = useFormik<SendModel>({
    initialValues: {
      address: "",
      amount: null,
      tag: "",
    },
    onSubmit: function (values) {
      navigation.navigate("SendConfirmation", { data: values, currency })
    },
    validationSchema: yup.object().shape({
      address: yup
        .string()
        .matches(
          /^(0x)[0-9A-Fa-f]{40}$/g,
          getFormErrorMessage("input.recipientAddress.label", "invalid"),
        )
        .test(
          "match",
          getFormErrorMessage("input.recipientAddress.label", "invalid"),
          function (value: string) {
            const { address } = getAddressByChain(currency.chain, activeWallet.addresses)
            return value !== address
          },
        )
        .required(getFormErrorMessage("input.recipientAddress.label", "required"))
        .nullable(),
      amount: yup
        .number()
        .required(getFormErrorMessage("input.amount.label", "invalid"))
        .max(currencyWallet.native, getFormErrorMessage("input.amount.label", "invalid"))
        .nullable(),
    }),
  })

  const { values, handleChange, setFieldValue, validateForm, handleSubmit } = formik

  // navigators
  useHeaderOption(
    {
      title: translate("navigators.screenName.send") + ` ${currency.shortName}`,
      headerTintColor: colors.white,
      headerStyle: { backgroundColor: colors.primary[500] },
      headerBackTitleStyle: { fontFamily: typography.primary.medium },
      headerRight: () => (
        <Button
          tx="common.next"
          className="min-h-0 px-0"
          preset="clear"
          textStyle="text-white uppercase"
          onPress={onSubmit}
        />
      ),
    },
    [values, currency],
  )

  // memos
  const estimatedAmount = useMemo<string>(() => {
    if (!values.amount) {
      return ""
    }

    return `~US${new BigNumber(values.amount).multipliedBy(currencyWallet.exchangeRate)}`
  }, [values.amount, currencyWallet.exchangeRate])

  // functions
  const handlePaste = async () => setFieldValue("address", await Clipboard.getString())
  const handleMaxAmount = () => setFieldValue("amount", currencyWallet.native)
  const onSubmit = async () => {
    const errors = await validateForm()

    if (Object.keys(errors).length) {
      Alert.alert(errors.address || errors.amount)
    } else {
      handleSubmit()
    }
  }

  return (
    <Screen preset="fixed" contentContainerStyle="flex-auto" backgroundColor={colors.background}>
      <View className="p-6">
        <TextField
          labelTx="input.recipientAddress.label"
          placeholderTx="input.recipientAddress.placeholder"
          containerStyle="mb-3"
          RightAccessory={() => (
            <View className="flex-row h-full">
              <TouchableOpacity className="px-2 justify-center" onPress={handlePaste}>
                <Text tx="common.paste" className="text-primary-500 uppercase text-sm" />
              </TouchableOpacity>
              <TouchableOpacity className="px-2 justify-center min-w-[45]">
                <Icon icon="qrScan" size={spacing.medium} color={colors.primary[500]} />
              </TouchableOpacity>
            </View>
          )}
          value={values.address}
          onChangeText={handleChange("address")}
        />
        <TextField
          keyboardType="decimal-pad"
          label={
            translate("input.amount.label") + ` ${currency.shortName} - ${currencyWallet.native}`
          }
          placeholderTx="input.amount.placeholder"
          RightAccessory={() => (
            <View className="flex-row h-full">
              <TouchableOpacity className="px-2 justify-center" onPress={handleMaxAmount}>
                <Text tx="common.max" className="text-primary-500 uppercase text-sm" />
              </TouchableOpacity>
              <TouchableOpacity className="px-2 justify-center min-w-[45]">
                <Text className="text-primary-500 text-sm">USD</Text>
              </TouchableOpacity>
            </View>
          )}
          value={!values.amount ? "" : String(values.amount)}
          onChangeText={handleChange("amount")}
          helper={estimatedAmount}
          HelperTextProps={{
            style: { color: colors.gray[500] },
          }}
        />
      </View>
    </Screen>
  )
})
