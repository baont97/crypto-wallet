import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  AddWalletScreen,
  GenerateSecretPhraseSreen,
  ImportWalletScreen,
  VerifySecretPhraseScreen,
} from "../screens"
import { IWallet } from "react-native-web3-wallet/interface"
import { translate } from "../i18n"

export type AddWalletStackParamList = {
  AddWallet: undefined
  ImportWallet: { password: string }
  GenerateSecretPhrase: { password: string }
  VerifySecretPhrase: { wallet: IWallet; mnemonicHeight: number }
}

export type AddWalletStackScreenProps<T extends keyof AddWalletStackParamList> = StackScreenProps<
  AddWalletStackParamList,
  T
>

const Stack = createNativeStackNavigator<AddWalletStackParamList>()

export const AddWalletStack = observer(function () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AddWallet" component={AddWalletScreen} />
      {/** Screens for import wallet */}
      <Stack.Screen
        name="ImportWallet"
        component={ImportWalletScreen}
        options={{ title: translate("navigators.screenName.importWallet") }}
      />
      {/** Screens for create new wallet */}
      <Stack.Screen
        name="GenerateSecretPhrase"
        component={GenerateSecretPhraseSreen}
        options={{ title: "", headerShadowVisible: false }}
      />
      <Stack.Screen
        name="VerifySecretPhrase"
        component={VerifySecretPhraseScreen}
        options={{ title: "", headerShadowVisible: false }}
      />
    </Stack.Navigator>
  )
})
