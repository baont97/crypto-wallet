import React, { FC } from "react"
import { WelcomeImageScrollView, Screen } from "../../components"
import { AppStackScreenProps } from "../../navigators"
import { View } from "react-native"
import { Button } from "../../components/Button"
import { CreateWalletType } from "../WalletScreen"

export const WelcomeScreen: FC<AppStackScreenProps<"Welcome">> = ({ navigation }) => {
  const handlePress = (type: CreateWalletType) => () => {
    navigation.navigate("Legal", { type })
  }

  return (
    <Screen preset="fixed" contentContainerStyle="flex-1" safeAreaEdges={["bottom"]}>
      <WelcomeImageScrollView />
      <View className="flex-auto justify-end px-6">
        <Button
          tx="welcome.createNewWallet"
          className="mb-4"
          onPress={handlePress("createNewWallet")}
          preset="filled"
        />
        <Button tx="welcome.importWallet" preset="clear" onPress={handlePress("importWallet")} />
      </View>
    </Screen>
  )
}
