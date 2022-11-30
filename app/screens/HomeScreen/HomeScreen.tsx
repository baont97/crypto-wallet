import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { RefreshControl, View } from "react-native"
import { Button, Icon, Screen, Text } from "../../components"
import { useBalance } from "../../hooks"
import { useStores } from "../../models"
import { AppBottomTabScreenProps } from "../../navigators/AppBottomTab"
import { colors, spacing } from "../../theme"
import { useHeaderOption } from "../../utils/useHeader"
import { HomeActions } from "./HomeActions"
import { HomeTabs } from "./HomeTabs"

import i18n from "i18n-js"

export const HomeScreen: FC<AppBottomTabScreenProps<"Home">> = observer(function () {
  // hooks
  const rootStore = useStores()

  useHeaderOption({
    headerTitle: "",
    headerStyle: { backgroundColor: colors.primary[500] },
    headerLeft: () => (
      <Button
        preset="clear"
        className="aspect-square"
        LeftAccessory={() => <Icon icon="bell" size={spacing.medium * 1.2} color={colors.white} />}
      />
    ),
    headerRight: () => (
      <Button
        preset="clear"
        className="aspect-square"
        LeftAccessory={() => (
          <Icon icon="filter" size={spacing.medium * 1.2} color={colors.white} />
        )}
      />
    ),
  })

  return (
    <Screen
      preset="scroll"
      contentContainerStyle="flex-1"
      statusBarStyle="light"
      ScrollViewProps={{
        refreshControl: (
          <RefreshControl tintColor={colors.white} refreshing={false} onRefresh={() => {}} />
        ),
      }}
      backgroundColor={colors.primary[500]}
    >
      <View className="items-center justify-center bg-primary-500">
        <Text className="text-white font-family-medium text-3xl">
          ${i18n.toCurrency(rootStore.walletStore.totalBalanceInFiat, { unit: "" })}
        </Text>
        <Text className="text-white">{rootStore.walletStore.activeWallet.name}</Text>

        <HomeActions />
      </View>
      <View className="bg-white rounded-t-md w-[100vw] min-h-[100vh]">
        <HomeTabs />
      </View>
    </Screen>
  )
})
