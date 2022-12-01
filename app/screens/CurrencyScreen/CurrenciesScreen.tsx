import React, { FC, useRef } from "react"
import { observer } from "mobx-react-lite"
import { Currencies, Screen, Text } from "../../components"
import { ReceiveStackScreenProps } from "../../navigators/ReceiveStack"
import { useHeaderOption } from "../../utils/useHeader"
import { colors } from "../../theme"
import { HeaderBackButton } from "@react-navigation/elements"
import { Currency } from "../../models"
import { getNavigationHeaderText } from "../../navigators"
import { translate } from "../../i18n"
import { useIsMounted } from "../../utils/useIsMounted"

interface CurrenciesScreenProps extends ReceiveStackScreenProps<"Currencies"> {}

export const CurrenciesScreen: FC<CurrenciesScreenProps> = observer(function ({
  route,
  navigation,
}) {
  // hooks
  const isMounted = useIsMounted()

  // refs
  const currenciesRef = useRef<typeof Currencies>()

  // navigators
  const type = route.params.type

  useHeaderOption(
    {
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
      headerSearchBarOptions: {
        // search bar options
        onChangeText: (event) =>
          currenciesRef?.current?.search && currenciesRef?.current?.search(event.nativeEvent.text),
        placeholder: translate("input.search.placeholder"),
        hintTextColor: colors.white,
        headerIconColor: colors.white,
        barTintColor: colors.white,
        hideWhenScrolling: false,
      },
    },
    [navigation],
  )

  // functions
  const handleItemPress = (currency: Currency) => {
    navigation.navigate(type as any, { currency })
  }

  return (
    <Screen statusBarStyle="light" preset="fixed" contentContainerStyle="flex-1">
      <Currencies ref={currenciesRef} onItemPress={handleItemPress} />
    </Screen>
  )
})
