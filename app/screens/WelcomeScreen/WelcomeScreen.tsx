import React, { FC } from "react"
import { WelcomeContent } from "../../components"
import { AppStackScreenProps } from "../../navigators"
import { CreateWalletType } from "../WalletScreen"

export const WelcomeScreen: FC<AppStackScreenProps<"Welcome">> = ({ navigation }) => {
  const handlePress = (type: CreateWalletType) => () => {
    navigation.navigate("Legal", { type })
  }

  return <WelcomeContent onPress={handlePress} />
}
