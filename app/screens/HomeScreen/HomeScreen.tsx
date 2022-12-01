import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { RefreshControl, View } from "react-native"
import { Icon, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { useHeaderOption } from "../../utils/useHeader"
import { HomeActions } from "./HomeActions"
import { HomeTabs } from "./HomeTabs"
import { HomeStackScreenProps } from "../../navigators/HomeStack"
import { HeaderBackButton } from "@react-navigation/elements"

import i18n from "i18n-js"

export const HomeScreen: FC<HomeStackScreenProps<"Home">> = observer(function () {
  // hooks
  const rootStore = useStores()

  useHeaderOption({
    headerTitle: "",
    headerStyle: { backgroundColor: colors.primary[500] },
    headerTintColor: colors.white,
    headerLeft: (props) => {
      return (
        <HeaderBackButton
          {...props}
          backImage={(props) => <Icon icon="bell" color={props.tintColor} />}
        />
      )
    },
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
