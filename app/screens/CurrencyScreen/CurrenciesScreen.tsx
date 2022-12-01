import React, { FC, useRef } from "react"
import { observer } from "mobx-react-lite"
import { Currencies, Screen, SearchField, Text } from "../../components"
import { ReceiveStackScreenProps } from "../../navigators/ReceiveStack"
import { useHeaderOption } from "../../utils/useHeader"
import { colors } from "../../theme"
import { HeaderBackButton } from "@react-navigation/elements"
import { Currency } from "../../models"
import { getNavigationHeaderText } from "../../navigators"
import { translate } from "../../i18n"

interface CurrenciesScreenProps extends ReceiveStackScreenProps<"Currencies"> {}

export const CurrenciesScreen: FC<CurrenciesScreenProps> = observer(function ({
  route,
  navigation,
}) {
  // refs
  const currenciesRef = useRef<typeof Currencies>()

  // navigators
  const type = route.params.type

  useHeaderOption({
    titleTx: getNavigationHeaderText(type),
    headerTintColor: colors.white,
    headerStyle: { backgroundColor: colors.primary[500] },
    headerRight: (props) => {
      return (
        <HeaderBackButton
          {...props}
          onPress={!props.canGoBack ? null : navigation.goBack}
          backImage={(props) => <Text style={{ color: props.tintColor }} tx="common.done" />}
        />
      )
    },
  })

  // functions
  const handleItemPress = (currency: Currency) => {
    navigation.navigate(type as any, { currency })
  }

  return (
    <Screen statusBarStyle="light" preset="fixed" contentContainerStyle="flex-1">
      <SearchField
        onChangeText={(text) => currenciesRef.current?.["search"](text)}
        placeholder={translate("input.search.placeholder")}
      />
      <Currencies ref={currenciesRef} onItemPress={handleItemPress} />
    </Screen>
  )
})
