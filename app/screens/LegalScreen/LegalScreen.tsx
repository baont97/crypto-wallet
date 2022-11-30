import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import React, { FC, useState } from "react"
import { View } from "react-native"
import { Screen, Text, RowItemGroup, Toggle, Button } from "../../components"
import { useKeychain } from "../../hooks"
import { translate } from "../../i18n"
import {
  AppStackParamList,
  AppStackScreenProps,
  getNavigationHeaderText,
  getPreviousRouteName,
} from "../../navigators"
import { useHeaderOption } from "../../utils/useHeader"

export const LegalScreen: FC<AppStackScreenProps<"Legal">> = ({ navigation }) => {
  return (
    <Screen preset="fixed" contentContainerStyle="flex-1" safeAreaEdges={["bottom"]}>
      <View className="flex-auto">
        <View className="px-8 my-6">
          <Text tx="legal.message" />
        </View>

        <RowItemGroup items={[{ leftTx: "legal.privacy" }, { leftTx: "legal.terms" }]} />
      </View>

      <Footer />
    </Screen>
  )
}

function Footer() {
  const navigation = useNavigation<NavigationProp<AppStackParamList, "Legal", undefined>>()
  const route = useRoute<RouteProp<AppStackParamList, "Legal">>()
  const passcodeHook = useKeychain({
    service: "PASSCODE",
    needHash: true,
  })

  // states
  const _checked = useState<boolean>(__DEV__)

  const handlePress = () => _checked[1]((prev) => !prev)

  const handleNavigate = async () => {
    await passcodeHook.load()
    navigation.navigate(
      passcodeHook.data.username ? "InputPasscode" : "SetupPasscode",
      route.params,
    )
  }

  return (
    <>
      <View className="px-6">
        <View className="mb-6">
          <Toggle
            value={_checked[0]}
            onPress={handlePress}
            labelStyle="text-primary-500"
            label="I've read and accept the term"
          />
        </View>

        <Button text="Continue" preset="filled" disabled={!_checked[0]} onPress={handleNavigate} />
      </View>
    </>
  )
}
