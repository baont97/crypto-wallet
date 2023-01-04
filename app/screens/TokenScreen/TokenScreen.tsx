import React, { FC, useMemo, useRef } from "react"
import { observer } from "mobx-react-lite"
import { Currencies, Icon, Screen, Text } from "../../components"
import { AppStackScreenProps } from "../../navigators"
import { useHeaderOption } from "../../utils/useHeader"
import { colors, spacing } from "../../theme"
import { HeaderBackButton } from "@react-navigation/elements"
import { Currency, useStores } from "../../models"
import { Image, Switch, TouchableOpacity, TouchableOpacityProps, View } from "react-native"
import { useHeaderSearchbar } from "../../hooks"

import Config from "../../config"

export const TokenScreen: FC<AppStackScreenProps<"Token">> = observer((props) => {
  const { navigation } = props
  const rootStore = useStores()

  // refs
  const currenciesRef = useRef<typeof Currencies>()
  const needSort = useRef<boolean>(true)

  const headerSearchBarOptions = useHeaderSearchbar(currenciesRef)

  const currencies = useMemo<Currency[]>(() => {
    if (needSort) {
      needSort.current = false
      return rootStore.currencyStore.allCurrencies.sort(
        (a, b) =>
          Number(rootStore.currencyStore.checkIsActive(b.id)) -
          Number(rootStore.currencyStore.checkIsActive(a.id)),
      )
    } else {
      return rootStore.currencyStore.allCurrencies
    }
  }, [needSort, rootStore.currencyStore.allCurrencies.length])

  useHeaderOption(
    {
      titleTx: "navigators.screenName.token",
      headerTintColor: colors.white,
      headerStyle: { backgroundColor: colors.primary[500] },
      headerLeft: (props) => {
        if (!Config.isIOS) return null
        return (
          <HeaderBackButton
            {...props}
            onPress={() => navigation.navigate("AddNewToken")}
            backImage={({ tintColor }) => (
              <Icon icon="plus" color={tintColor} size={spacing.medium} />
            )}
          />
        )
      },
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
    [navigation, headerSearchBarOptions],
  )

  return (
    <Screen statusBarStyle="light" preset="fixed" contentContainerStyle="flex-1">
      <Currencies
        ref={currenciesRef}
        onItemPress={undefined}
        filterFunct={undefined}
        data={currencies}
        renderItem={({ item, index }) => {
          return (
            <>
              <CurrencyItem data={item} />
              {index === currencies.length - 1 && <View className="h-[80px]" />}
            </>
          )
        }}
      />

      {!Config.isIOS && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("AddNewToken")}
          className="rounded-full absolute right-4 bottom-4 w-[45px] h-[45px] border-0 bg-primary-500 items-center justify-center"
        >
          <Icon icon="plus" size={spacing.medium} />
        </TouchableOpacity>
      )}
    </Screen>
  )
})

interface CurrencyItemProps extends TouchableOpacityProps {
  data: Currency
}

const CurrencyItem: FC<CurrencyItemProps> = observer(function (props) {
  const { data, ...rest } = props

  const rootStore = useStores()
  const isActive = rootStore.currencyStore.checkIsActive(data.id)

  const onToggle = () => rootStore.currencyStore.toggleCurrency(data.id)

  return (
    <TouchableOpacity {...rest} onPress={onToggle} activeOpacity={0.8}>
      <View className="flex-row items-center px-3 py-4">
        {!data.image ? (
          <CurrencyDefaultAvatar shortName={data.shortName} />
        ) : (
          <Image source={{ uri: data.image }} className="w-[45px] aspect-square rounded-full" />
        )}
        <View className="flex-auto px-3">
          <View className="flex-1 justify-center">
            <Text>{data.name}</Text>
          </View>
        </View>

        <Switch value={isActive} onValueChange={onToggle} />
      </View>
    </TouchableOpacity>
  )
})

interface CurrencyDefaultAvatarProps {
  shortName: string
}

export const CurrencyDefaultAvatar: FC<CurrencyDefaultAvatarProps> = (props) => {
  const { shortName } = props

  const content = shortName.slice(0, 3)

  return (
    <View className="w-[45px] aspect-square rounded-full bg-primary-200 items-center justify-center">
      <Text className="text-primary-500">{content}</Text>
    </View>
  )
}
