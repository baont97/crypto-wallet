import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  CurrenciesScreen,
  CurrenciesScreenType,
  SendScreen,
  SendConfirmationScreen,
  SendResultScreen,
  ScanScreen,
} from "../screens"
import { Currency } from "../models"
import { SendModel } from "../screens/SendScreen/SendScreen.types"
import { ethers } from "ethers"

export type SendStackParamList = {
  Currencies: { type: CurrenciesScreenType }
  Send: { currency: Currency; qrcode: "" }
  SendConfirmation: { currency: Currency; data: SendModel }
  SendResult: {
    tx: ethers.providers.TransactionResponse
    currency: Currency
  }
  Scan: {
    from: string
    additionParams: any
  }
}

export type SendStackScreenProps<T extends keyof SendStackParamList> = StackScreenProps<
  SendStackParamList,
  T
>

const Stack = createNativeStackNavigator<SendStackParamList>()

export const SendStack = observer(function () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Currencies"
        component={CurrenciesScreen}
        initialParams={{ type: "Send" }}
      />
      <Stack.Screen name="Send" component={SendScreen} />
      <Stack.Screen name="SendConfirmation" component={SendConfirmationScreen} />
      <Stack.Screen name="SendResult" component={SendResultScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} options={{ presentation: "modal" }} />
    </Stack.Navigator>
  )
})
