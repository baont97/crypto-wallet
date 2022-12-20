import React, { FC, useRef } from "react"
import { observer } from "mobx-react-lite"
import { Button, Icon, Screen, Text } from "../../components"
import { ReceiveStackScreenProps } from "../../navigators/ReceiveStack"
import { useHeaderOption } from "../../utils/useHeader"
import { translate } from "../../i18n"
import { colors, spacing } from "../../theme"
import { useWindowDimensions, View } from "react-native"
import { useStores } from "../../models"
import { getRandomId } from "../../utils/string"
import { images } from "../../../assets"

import Clipboard from "@react-native-clipboard/clipboard"
import Share from "react-native-share"
import QRCode from "react-native-qrcode-svg"
import Toast from "react-native-simple-toast"
import { getAddressByChain } from "../../utils/common"

export const ReceiveScreen: FC<ReceiveStackScreenProps<"Receive">> = observer(function ({ route }) {
  // navigators
  const currency = route.params.currency

  // refs
  const qrCodeRef = useRef<QRCode>(null)

  // hooks
  const rootStore = useStores()
  const { address } = getAddressByChain(
    currency.chain,
    rootStore.walletStore.activeWallet.addresses,
  )
  const dimentions = useWindowDimensions()

  useHeaderOption({
    title: translate("navigators.screenName.receive") + ` ${currency.shortName}`,
    headerTintColor: colors.white,
    headerStyle: { backgroundColor: colors.primary[500] },
  })

  // functions
  const handleSharePress = () => {
    qrCodeRef.current["toDataURL"]((base64: string) =>
      Share.open({
        url: "data:image/png;base64," + base64,
        filename: `receive_${getRandomId()}`,
        failOnCancel: false,
      }),
    )
  }
  const handleCopyPress = () => {
    Clipboard.setString(address)
    Toast.show(translate("common.copied"), Toast.SHORT)
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle="flex-auto items-center justify-center"
      backgroundColor={colors.background}
    >
      <View>
        <View className="rounded-lg shadow items-center bg-white p-4">
          <QRCode
            getRef={(c) => (qrCodeRef.current = c)}
            value={address}
            size={dimentions.width * 0.5}
            logo={images.logo}
            logoBackgroundColor={colors.white}
            logoMargin={spacing.small}
            logoBorderRadius={spacing.small}
          />

          <Text className="text-center text-sm text-gray-500 mt-3 max-w-[55vw]">{address}</Text>
        </View>

        <View className="flex-row py-4 justify-center">
          <View className="items-center mr-6">
            <Button
              preset="filled"
              className="rounded-full h-[55] w-[55] shadow"
              LeftAccessory={() => (
                <Icon size={spacing.large * 0.85} icon="copy" color={colors.white} />
              )}
              onPress={handleCopyPress}
            />
            <Text tx="common.copy" />
          </View>
          <View className="items-center">
            <Button
              preset="filled"
              className="rounded-full h-[55] w-[55] shadow"
              LeftAccessory={() => (
                <Icon size={spacing.large * 0.85} icon="share" color={colors.white} />
              )}
              onPress={handleSharePress}
            />
            <Text tx="common.share" />
          </View>
        </View>
      </View>
    </Screen>
  )
})
