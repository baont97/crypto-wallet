import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { ManageWalletScreen, SettingsScreen } from "../screens"
import { AddWalletStack } from "./AddWalletStack"

export type SettingsStackParamList = {
  Settings: undefined
  ManageWallet: undefined
  AddWalletStack: undefined
}

export type SettingsStackScreenProps<T extends keyof SettingsStackParamList> = StackScreenProps<
  SettingsStackParamList,
  T
>

const Stack = createNativeStackNavigator<SettingsStackParamList>()

export const SettingsStack = observer(function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ManageWallet" component={ManageWalletScreen} />
      <Stack.Screen
        name="AddWalletStack"
        component={AddWalletStack}
        options={{ headerShown: false, presentation: "modal", navigationBarHidden: true }}
      />
    </Stack.Navigator>
  )
})
