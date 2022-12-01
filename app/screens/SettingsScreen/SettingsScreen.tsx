import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Button, Screen } from "../../components"
import { useStores } from "../../models"
import { AppBottomTabScreenProps } from "../../navigators/AppBottomTab"
import { colors } from "../../theme"
import { useHeaderOption } from "../../utils/useHeader"

export const SettingsScreen: FC<AppBottomTabScreenProps<"Settings">> = observer(function ({
  route,
  navigation,
}) {
  useHeaderOption({
    titleTx: "navigators.screenName.settings",
    headerStyle: { backgroundColor: colors.primary[500] },
    headerTintColor: colors.white,
  })

  const rootStore = useStores()

  return (
    <Screen
      preset="fixed"
      contentContainerStyle="flex-1"
      statusBarStyle="light"
      safeAreaEdges={["bottom"]}
    >
      <Button onPress={() => rootStore.walletStore.clearWallet()} />
    </Screen>
  )
})
