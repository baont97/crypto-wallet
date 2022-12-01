import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { CurrenciesScreen, CurrenciesScreenType, ReceiveScreen } from "../screens"
import { Currency } from "../models"

export type ReceiveStackParamList = {
  Currencies: { type: CurrenciesScreenType }
  Receive: { currency: Currency }
}

export type ReceiveStackScreenProps<T extends keyof ReceiveStackParamList> = StackScreenProps<
  ReceiveStackParamList,
  T
>

const Stack = createNativeStackNavigator<ReceiveStackParamList>()

export const ReceiveStack = observer(function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Currencies"
        component={CurrenciesScreen}
        initialParams={{ type: "Receive" }}
      />
      <Stack.Screen name="Receive" component={ReceiveScreen} />
    </Stack.Navigator>
  )
})
