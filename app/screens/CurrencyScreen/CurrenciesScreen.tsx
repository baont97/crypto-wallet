import React, { FC, useMemo, useRef } from "react"
import { observer } from "mobx-react-lite"
import { Currencies, Screen, Text } from "../../components"
import { ReceiveStackScreenProps } from "../../navigators/ReceiveStack"
import { useHeaderOption } from "../../utils/useHeader"
import { colors } from "../../theme"
import { HeaderBackButton } from "@react-navigation/elements"
import { Currency, useStores } from "../../models"
import { getNavigationHeaderText } from "../../navigators"
import { translate } from "../../i18n"
import { useHeaderSearchbar } from "../../hooks"
import Config from "../../config"

interface CurrenciesScreenProps extends ReceiveStackScreenProps<"Currencies"> {}

export const CurrenciesScreen: FC<CurrenciesScreenProps> = observer(function ({
  route,
  navigation,
}) {
  // hooks
  const rootStore = useStores()

  // refs
  const currenciesRef = useRef<typeof Currencies>()
  const headerSearchBarOptions = useHeaderSearchbar(currenciesRef)

  // navigators
  const type = route.params.type

  useHeaderOption(
    {
      titleTx: getNavigationHeaderText(type),
      headerTintColor: colors.white,
      headerStyle: { backgroundColor: colors.primary[500] },
      headerRight: (props) => {
        if (!Config.isIOS) return null
        return (
          <HeaderBackButton
            {...props}
            onPress={!props.canGoBack ? null : navigation.goBack}
            backImage={(props) => <Text style={{ color: props.tintColor }} tx="common.done" />}
          />
        )
      },
      headerSearchBarOptions,
    },
    [navigation],
  )

  // memos
  const filterFunct = useMemo<(x: Currency, y: number, z: []) => boolean>(() => {
    switch (type) {
      case "Receive":
        return () => true
      case "Buy":
        return () => true
      case "Send":
        return (currency) => rootStore.walletStore.getBalanceByCurrencyId(currency.id).native > 0
    }
  }, [type])

  // functions
  const handleItemPress = (currency: Currency) => {
    navigation.navigate(type as any, { currency })
  }

  return (
    <Screen statusBarStyle="light" preset="fixed" contentContainerStyle="flex-1">
      <Currencies ref={currenciesRef} onItemPress={handleItemPress} {...{ filterFunct }} />
    </Screen>
  )
})
