/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from "react"
import Config from "../config"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { useColorScheme } from "react-native"
import {
  CreateWalletType,
  GenerateSecretPhraseSreen,
  ImportWalletScreen,
  InputPasscodeScreen,
  SetupPasscodeScreen,
  VerifySecretPhraseScreen,
  WelcomeScreen,
  SendScreen,
} from "../screens"
import { LegalScreen } from "../screens/LegalScreen/LegalScreen"
import { navigationTheme } from "../theme/theme"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { AppBottomTab } from "./AppBottomTab"
import { useStores } from "../models"
import { IWallet } from "react-native-web3-wallet/interface"
import { translate } from "../i18n"
import { spacing, typography } from "../theme"
import { useBalance } from "../hooks"
import { ReceiveStack } from "./ReceiveStack"
import { SendStack } from "./SendStack"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  AppBottomTab: undefined

  Legal: { type: CreateWalletType }
  SetupPasscode: { type: CreateWalletType }
  InputPasscode: { type: CreateWalletType }

  SendStack: undefined
  ReceiveStack: undefined
  Buy: undefined
  Swap: undefined

  /**
   * Import existed wallet
   */
  ImportWallet: { password: string }

  /**
   * Create new wallet
   */
  GenerateSecretPhrase: { password: string }
  VerifySecretPhrase: { wallet: IWallet; mnemonicHeight: number }
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = StackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  // stores
  const rootStore = useStores()

  /**
   * get balance if we have address
   */
  useBalance()

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: typography.primary.medium,
        },
        headerBackTitleVisible: false,
      }}
    >
      {rootStore.walletStore.isHaveWallet ? (
        <Stack.Group>
          <Stack.Screen
            name="AppBottomTab"
            component={AppBottomTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SendStack"
            component={SendStack}
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="ReceiveStack"
            component={ReceiveStack}
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Legal"
            component={LegalScreen}
            options={{
              title: translate("navigators.screenName.legal"),
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="SetupPasscode"
            component={SetupPasscodeScreen}
            options={{ title: translate("navigators.screenName.setupPasscode") }}
          />
          <Stack.Screen
            name="InputPasscode"
            component={InputPasscodeScreen}
            options={{
              headerShown: false,
              title: translate("navigators.screenName.inputPasscode"),
            }}
          />
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
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme() || "dark"

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} {...props} theme={navigationTheme[colorScheme]}>
      <AppStack />
    </NavigationContainer>
  )
})
