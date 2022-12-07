import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Text, WelcomeContent } from "../../../components"
import { AddWalletStackScreenProps } from "../../../navigators/AddWalletStack"
import { colors } from "../../../theme"
import { useHeaderOption } from "../../../utils/useHeader"
import { HeaderBackButton } from "@react-navigation/elements"
import { CreateWalletType } from "../CreateWalletScreen.types"

export const AddWalletScreen: FC<AddWalletStackScreenProps<"AddWallet">> = observer(function (
  props,
) {
  // navigators
  const { navigation } = props
  useHeaderOption({
    headerTintColor: colors.primary[500],
    title: "",
    headerLeft: (props) => (
      <HeaderBackButton
        {...props}
        onPress={!props.canGoBack ? null : navigation.goBack}
        backImage={(props) => <Text style={{ color: props.tintColor }} tx="common.cancel" />}
      />
    ),
  })

  // functions
  const handlePress = (type: CreateWalletType) => () => {
    switch (type) {
      case "createNewWallet":
        navigation.navigate("GenerateSecretPhrase")
        break
      case "importWallet":
        navigation.navigate("ImportWallet")
        break
    }
  }

  return <WelcomeContent onPress={handlePress} />
})
