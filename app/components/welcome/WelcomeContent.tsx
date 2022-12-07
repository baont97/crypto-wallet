import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View } from "react-native"
import { Button, Screen } from ".."
import { CreateWalletType } from "../../screens"
import { WelcomeImageScrollView } from "./WelcomeImages"

export interface WelcomeContentProps {
  onPress: (type: CreateWalletType) => () => void
}

export const WelcomeContent: FC<WelcomeContentProps> = observer(function (props) {
  const { onPress } = props

  return (
    <Screen preset="fixed" contentContainerStyle="flex-1" safeAreaEdges={["bottom"]}>
      <WelcomeImageScrollView />
      <View className="flex-auto justify-end px-6">
        <Button
          tx="welcome.createNewWallet"
          className="mb-4"
          onPress={onPress("createNewWallet")}
          preset="filled"
        />
        <Button tx="welcome.importWallet" preset="clear" onPress={onPress("importWallet")} />
      </View>
    </Screen>
  )
})
