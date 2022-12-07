import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import { Currency } from "../models"
import { observer } from "mobx-react-lite"
import { CurrencyDetailScreen, HomeScreen, ManageWalletScreen } from "../screens"

export type HomeStackParamList = {
  Home: undefined
  CurrencyDetail: { currency: Currency }
}

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = StackScreenProps<
  HomeStackParamList,
  T
>

const Stack = createNativeStackNavigator<HomeStackParamList>()

export const HomeStack = observer(function () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CurrencyDetail" component={CurrencyDetailScreen} />
    </Stack.Navigator>
  )
})
