import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Icon, RowItemGroup, Screen } from "../../../components"
import { useStores, Wallet } from "../../../models"
import { SettingsStackScreenProps } from "../../../navigators/SettingsStack"
import { colors, spacing } from "../../../theme"
import { useHeaderOption } from "../../../utils/useHeader"
import { HeaderBackButton } from "@react-navigation/elements"
import { translate } from "../../../i18n"
import { resetRoot } from "../../../navigators"

export const ManageWalletScreen: FC<SettingsStackScreenProps<"ManageWallet">> = observer(function (
  props,
) {
  const { navigation } = props
  const rootStore = useStores()

  // functions
  const handleAddNewWallet = () => {
    navigation.navigate("AddWalletStack")
  }
  const getWalletName = (wallet: Wallet) => {
    let result = wallet.name
    const isMain = rootStore.walletStore.activeWalletId === wallet.id
    result += isMain ? ` (${translate("common.main")})` : ""

    return result
  }
  const updateActiveWallet = (id: string) => {
    if (rootStore.walletStore.activeWalletId !== id) {
      rootStore.walletStore.setProp("activeWalletId", id)
      resetRoot({
        index: 0,
        routes: [{ name: "AppBottomTab" }],
      })
    }
  }
  const handleShowDetail = (wallet: Wallet) => {
    navigation.navigate("WalletDetails", { wallet })
  }

  // navigators
  useHeaderOption(
    {
      titleTx: "navigators.screenName.manageWallet",
      headerStyle: { backgroundColor: colors.primary[500] },
      headerTintColor: colors.white,
      headerRight: (props) => {
        return (
          <HeaderBackButton
            {...props}
            onPress={handleAddNewWallet}
            backImage={(props) => (
              <Icon icon="plus" color={props.tintColor} size={spacing.medium} />
            )}
          />
        )
      },
    },
    [handleAddNewWallet],
  )

  return (
    <Screen contentContainerStyle="flex-1 py-6" statusBarStyle="light" className="bg-background">
      <RowItemGroup
        items={rootStore.walletStore.wallets.map((item) => ({
          left: getWalletName(item),
          onPress: () => updateActiveWallet(item.id),
          iconRightProps: {
            icon: "info",
            onPress: () => handleShowDetail(item),
          },
        }))}
      />
    </Screen>
  )
})
