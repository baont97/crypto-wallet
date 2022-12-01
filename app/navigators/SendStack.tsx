import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { CurrenciesScreen, CurrenciesScreenType, SendScreen } from "../screens"

export type SendStackParamList = {
  Send: undefined
  Currencies: { type: CurrenciesScreenType }
}

export type SendStackScreenProps<T extends keyof SendStackParamList> = StackScreenProps<
  SendStackParamList,
  T
>

const Stack = createNativeStackNavigator<SendStackParamList>()

export const SendStack = observer(function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Send" component={SendScreen} />
    </Stack.Navigator>
  )
})
