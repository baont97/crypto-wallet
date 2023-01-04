import React, { ComponentType, FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "../../navigators"
import { Divider, Icon, Screen, Text, TextProps } from "../../components"
import { useHeaderOption } from "../../utils/useHeader"
import { colors, spacing } from "../../theme"
import { HeaderBackButton } from "@react-navigation/elements"
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"
import { styled } from "nativewind"
import { useFormik } from "formik"
import { translate } from "../../i18n"
import { AddTokenModel } from "./AddNewTokenScreen.types"
import { getFormErrorMessage, getRandomId } from "../../utils/string"
import { Currency, useStores } from "../../models"
import { SUPPORTED_CHAINS } from "../../config/contants"
import { debounce } from "../../utils/common"
import { delay } from "../../utils/delay"

import * as yup from "yup"
import Config from "../../config"

export const AddNewTokenScreen: FC<AppStackScreenProps<"AddNewToken">> = observer((props) => {
  const { navigation, route } = props
  const rootStore = useStores()

  // state
  const [submitting, setSubmitting] = useState<boolean>(false)

  useHeaderOption(
    {
      titleTx: "navigators.screenName.addCustomToken",
      headerTintColor: colors.white,
      headerStyle: { backgroundColor: colors.primary[500] },
      headerLeft: (props) => {
        if (!Config.isIOS) return null
        return (
          <HeaderBackButton
            {...props}
            onPress={!props.canGoBack ? null : navigation.goBack}
            backImage={({ tintColor }) => <Text style={{ color: tintColor }} tx="common.cancel" />}
          />
        )
      },
      headerRight: (props) => {
        return (
          <HeaderBackButton
            {...props}
            onPress={handleSubmit}
            backImage={({ tintColor }) => <Text style={{ color: tintColor }} tx="common.done" />}
            disabled={submitting}
          />
        )
      },
    },
    [navigation, submitting],
  )

  // form
  const formik = useFormik<AddTokenModel>({
    initialValues: {
      contractAddress: route.params?.qrcode,
      name: "",
      symbol: "",
      decimals: "",
    },
    onSubmit: function (values) {
      setSubmitting(true)
      delay(200).then(() => setSubmitting(false))
      const currency: Currency = {
        chain: SUPPORTED_CHAINS.ETH,
        contractAddress: values.contractAddress,
        decimals: Number(values.decimals),
        id: getRandomId(),
        image: "",
        name: values.name,
        priceChangePercentage24h: 0,
        shortName: values.symbol,
      }
      debounce(rootStore.currencyStore.addCustomCurrency(currency), 500)()
      navigation.goBack()
    },
    validationSchema: yup.object().shape({
      contractAddress: yup
        .string()
        .required(getFormErrorMessage("input.contractAddress.label", "required"))
        .matches(
          /^(0x)[0-9A-Fa-f]{40}$/g,
          getFormErrorMessage("input.contractAddress.label", "invalid"),
        )
        .nullable(),
      name: yup.string().required(getFormErrorMessage("input.name.label", "required")).nullable(),
      symbol: yup
        .string()
        .required(getFormErrorMessage("input.symbol.label", "required"))
        .nullable(),
      decimals: yup
        .string()
        .required(getFormErrorMessage("input.decimals.label", "required"))
        .nullable(),
    }),
    enableReinitialize: true
  })

  const { values, handleChange, errors, touched, setFieldTouched, handleSubmit } = formik

  const handleScan = () => {
    navigation.navigate("Scan", {
      from: "AddNewToken",
      additionParams: route.params,
    })
  }

  return (
    <Screen
      statusBarStyle="light"
      preset="auto"
      contentContainerStyle="flex-1 p-4"
      className="bg-background"
    >
      <Item
        disabled
        LeftAccessory={() => <Text>Network</Text>}
        RightAccessory={() => <Text className="text-gray-500">Ethereum</Text>}
        innerStyle="rounded-xl"
        className="mb-8"
      />

      <View className="bg-white rounded-xl overflow-hidden">
        <Input
          label={translate("input.contractAddress.placeholder")}
          placeholder={translate("input.contractAddress.placeholder")}
          className="text-base px-4 w-full"
          placeholderTextColor={colors.gray[500]}
          errorMessage={touched.contractAddress && errors.contractAddress}
          value={values.contractAddress}
          onChangeText={handleChange("contractAddress")}
          onBlur={() => setFieldTouched("contractAddress", true)}
          RightAccessory={() => (
            <TouchableOpacity className="justify-center w-[45] h-[45]" onPress={handleScan}>
              <Icon icon="qrScan" size={spacing.medium} color={colors.primary[500]} />
            </TouchableOpacity>
          )}
        />
        <Divider />
        <Input
          label={translate("input.name.placeholder")}
          placeholder={translate("input.name.placeholder")}
          className="text-base px-4 w-full"
          placeholderTextColor={colors.gray[500]}
          errorMessage={touched.name && errors.name}
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={() => setFieldTouched("name", true)}
        />
        <Divider />
        <Input
          label={translate("input.symbol.placeholder")}
          placeholder={translate("input.symbol.placeholder")}
          className="text-base px-4 w-full"
          placeholderTextColor={colors.gray[500]}
          errorMessage={touched.symbol && errors.symbol}
          value={values.symbol}
          onChangeText={handleChange("symbol")}
          onBlur={() => setFieldTouched("symbol", true)}
          autoCapitalize="characters"
        />
        <Divider />
        <Input
          label={translate("input.decimals.placeholder")}
          placeholder={translate("input.decimals.placeholder")}
          className="text-base px-4 w-full"
          placeholderTextColor={colors.gray[500]}
          errorMessage={touched.decimals && errors.decimals}
          value={values.decimals}
          onChangeText={handleChange("decimals")}
          onBlur={() => setFieldTouched("decimals", true)}
          keyboardType="numeric"
        />
      </View>
      <View className="mt-4 p-6 bg-orange-100 rounded-lg">
        <Text className="text-orange-800" tx="addNewToken.hint" />
      </View>
    </Screen>
  )
})

interface ItemAccessoryProps {
  style?: StyleProp<any>
}

interface ItemProps extends TouchableOpacityProps {
  LeftAccessory: ComponentType<ItemAccessoryProps>
  RightAccessory?: ComponentType<ItemAccessoryProps>
  innerStyle?: StyleProp<ViewStyle>
}

const _Item: FC<ItemProps> = observer((props) => {
  const { LeftAccessory, RightAccessory, innerStyle, ...rest } = props

  return (
    <TouchableOpacity {...rest}>
      <View className="bg-white p-4 flex-row justify-between" style={innerStyle}>
        <LeftAccessory />
        {Boolean(RightAccessory) && <RightAccessory />}
      </View>
    </TouchableOpacity>
  )
})

const Item = styled<ItemProps, "innerStyle", any>(_Item, {
  props: {
    innerStyle: true,
  },
})

interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>
  errorMessage?: string
  label?: string

  LeftAccessory?: ComponentType<ItemAccessoryProps>
  RightAccessory?: ComponentType<ItemAccessoryProps>
}

const _Input: FC<InputProps> = (props) => {
  const {
    containerStyle: $styleOverride,
    errorMessage,
    label,
    LeftAccessory,
    RightAccessory,
    ...rest
  } = props

  return (
    <View className="w-full pt-4" style={$styleOverride}>
      {Boolean(rest.value) && Boolean(label) && <LabelText>{label}</LabelText>}

      <View className="flex-row items-center">
        {Boolean(LeftAccessory) && <LeftAccessory />}
        <TextInput {...rest} className="flex-1" style={rest.style} />
        {Boolean(RightAccessory) && <RightAccessory />}
      </View>

      {Boolean(errorMessage) && <ErrorMessageText>{errorMessage}</ErrorMessageText>}
    </View>
  )
}

const Input = styled<InputProps, "style" | "containerStyle", any>(_Input, {
  props: {
    containerStyle: true,
  },
})

const LabelText: FC<TextProps> = (props) => {
  const { ...rest } = props

  return <Text className="text-gray-400 ml-4 text-xs" {...rest} />
}

const ErrorMessageText: FC<TextProps> = (props) => {
  const { ...rest } = props

  return (
    <View className="w-full ml-4">
      <Divider />
      <Text className="text-xs text-rose-400 my-1" {...rest} />
    </View>
  )
}
