import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Button, Screen } from "../../components"
import { useStores } from "../../models"
import { AppBottomTabScreenProps } from "../../navigators/AppBottomTab"

export const SettingsScreen: FC<AppBottomTabScreenProps<"Settings">> = observer(function ({
  route,
  navigation,
}) {
  const rootStore = useStores()

  return (
    <Screen preset="fixed" contentContainerStyle="flex-1" safeAreaEdges={["bottom"]}>
      <Button onPress={() => rootStore.walletStore.clearWallet()} />
    </Screen>
  )
})
