import { NavigationProp, useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, TouchableOpacity, TouchableOpacityProps, View } from "react-native"
import { Divider, Text } from "../../components"
import { Currency, useStores } from "../../models"
import { HomeStackParamList } from "../../navigators/HomeStack"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { web3 } from "../../utils/web3"

interface HomeTabsProps {}

export const HomeTabs: FC<HomeTabsProps> = observer(function () {
  // hooks
  const navigation = useNavigation<NavigationProp<HomeStackParamList, "Home">>()

  // animated hooks
  const rootStore = useStores()
  const translationX = useSharedValue(0)

  const tabviewStylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: -translationX.value,
        },
      ],
    }
  })

  const handlePressToken = (currency: Currency) => {
    navigation.navigate("CurrencyDetail", { currency })
  }

  return (
    <View>
      <Animated.View className="flex-row" style={tabviewStylez}>
        <View className="w-[100vw]">
          {rootStore.currencyStore.currencies.map((item, index, { length }) => (
            <TokenItem
              data={item}
              key={index}
              hideDivider={index === length - 1}
              onPress={() => handlePressToken(item)}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  )
})

interface TokenItemProps extends TouchableOpacityProps {
  data: Currency
  hideDivider: boolean
}

const TokenItem: FC<TokenItemProps> = observer(function (props) {
  // hooks
  const rootStore = useStores()
  const { data, hideDivider, ...rest } = props
  const balance = rootStore.walletStore.getBalanceByCurrencyId(data.id)

  return (
    <TouchableOpacity {...rest}>
      <View className="flex-row items-center px-3 py-4">
        <Image source={{ uri: data.image }} className="w-[45px] aspect-square rounded-full" />
        <View className="flex-auto px-3">
          <View className="flex-1 justify-center">
            <Text>{data.name}</Text>
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500 font-family-light mr-2">
                ${balance.exchangeRate}
              </Text>

              <Text
                className={`text-xs font-family-light text-green-500 text-${
                  data.priceChangePercentage24h >= 0 ? "green" : "red"
                }-700`}
              >
                {data.priceChangePercentage24h >= 0 ? "+" : "-"}
                {Math.abs(data.priceChangePercentage24h)}%
              </Text>
            </View>
          </View>
        </View>
        <Text>
          {web3.ether.bigNumberFormatUnits(
            web3.ether.bigNumberParseUnits(balance.native + "", data.decimals),
            data.decimals,
          )}{" "}
          {data.shortName}
        </Text>
      </View>
      {hideDivider ? null : <Divider className="ml-[70px] h-[0.5px]" />}
    </TouchableOpacity>
  )
})
