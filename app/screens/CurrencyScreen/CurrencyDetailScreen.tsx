import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { HomeStackScreenProps } from "../../navigators/HomeStack"
import { colors } from "../../theme"
import { useHeaderOption } from "../../utils/useHeader"

export const CurrencyDetailScreen: FC<HomeStackScreenProps<"CurrencyDetail">> = observer(function ({
  route,
}) {
  const currency = route.params.currency

  useHeaderOption({
    headerStyle: { backgroundColor: colors.primary[500] },
    headerTintColor: colors.white,
    title: currency.name,
  })

  return <Screen statusBarStyle="light"></Screen>
})
