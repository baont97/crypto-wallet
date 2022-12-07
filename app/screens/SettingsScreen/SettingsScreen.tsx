import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { transparent } from "tailwindcss/colors"
import { Button, RowItemGroup, Screen } from "../../components"
import { useStores } from "../../models"
import { resetRoot } from "../../navigators"
import { SettingsStackParamList, SettingsStackScreenProps } from "../../navigators/SettingsStack"
import { colors } from "../../theme"
import { useHeaderOption } from "../../utils/useHeader"

export const SettingsScreen: FC<SettingsStackScreenProps<"Settings">> = observer(function ({
  navigation,
}) {
  const rootStore = useStores()

  // navigators
  useHeaderOption({
    titleTx: "navigators.screenName.settings",
    headerStyle: { backgroundColor: colors.primary[500] },
    headerTintColor: colors.white,
  })

  // functions
  const handlePress = (screenName: keyof SettingsStackParamList) => () => {
    navigation.navigate(screenName)
  }

  return (
    <Screen contentContainerStyle="flex-1 py-6" statusBarStyle="light" className="bg-background">
      <RowItemGroup
        className="mb-5"
        items={[
          {
            iconLeftProps: { icon: "walletColorful" },
            leftTx: "settings.wallets",
            onPress: handlePress("ManageWallet"),
            disabledLeftTintColor: true,
            right: rootStore.walletStore.activeWallet.name,
          },
        ]}
      />
      {/* <Button onPress={() => rootStore.walletStore.clearWallet()} /> */}
    </Screen>
  )
})
