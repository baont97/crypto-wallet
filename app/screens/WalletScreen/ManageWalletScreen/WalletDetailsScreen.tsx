import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Icon, RowItemGroup, Screen, Text, TextField } from "../../../components"
import { useStores, Wallet } from "../../../models"
import { SettingsStackScreenProps } from "../../../navigators/SettingsStack"
import { colors, spacing } from "../../../theme"
import { useHeaderOption } from "../../../utils/useHeader"
import { HeaderBackButton } from "@react-navigation/elements"
import { translate } from "../../../i18n"
import { resetRoot } from "../../../navigators"
import { View } from "react-native"

import Clipboard from "@react-native-clipboard/clipboard"
import Toast from "react-native-simple-toast"

export const WalletDetailsScreen: FC<SettingsStackScreenProps<"WalletDetails">> = observer(
  function (props) {
    const { navigation, route } = props
    const rootStore = useStores()
    const { wallet } = route.params

    // functions

    // navigators
    useHeaderOption(
      {
        title: wallet.name,
        headerStyle: { backgroundColor: colors.primary[500] },
        headerTintColor: colors.white,
      },
      [wallet],
    )

    const handleCopyPress = (address: string) => {
      Clipboard.setString(address)
      Toast.show(translate("common.copied"), Toast.SHORT)
    }

    return (
      <Screen contentContainerStyle="flex-1 p-6" statusBarStyle="light" className="bg-background">
        <TextField
          labelTx="input.walletName.label"
          placeholderTx="input.walletName.placeholder"
          value={wallet.name}
          containerStyle="mb-4"
        />
        {wallet.addresses.map((x) => (
          <TextField
            key={x.id}
            label={x.chain}
            value={x.address}
            editable={false}
            containerStyle="mb-4"
            multiline
            RightAccessory={() => (
              <Icon
                onPress={() => handleCopyPress(x.address)}
                icon="copy"
                className="m-4 tint-color-gray-400"
                size={spacing.medium}
              />
            )}
          />
        ))}
      </Screen>
    )
  },
)
