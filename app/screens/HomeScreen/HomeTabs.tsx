import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import {
  Image,
  TouchableOpacity,
  TouchableOpacityProps,
  useWindowDimensions,
  View,
} from "react-native"
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { $baseStyle, Divider, Text } from "../../components"
import { translate } from "../../i18n"
import { Currency, useStores } from "../../models"
import { colors } from "../../theme"
import { HomeTab } from "./HomeScreen.types"
import { HomeTabs as HomeTabList } from "./HomeScreen.types"

interface HomeTabsProps {}

export const HomeTabs: FC<HomeTabsProps> = observer(function () {
  // animated hooks
  const rootStore = useStores()
  const dimentions = useWindowDimensions()
  const translationX = useSharedValue(0)
  const dividerStylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            translationX.value,
            [0, dimentions.width, dimentions.width * 2],
            [0, dimentions.width / 2, dimentions.width],
          ),
        },
      ],
    }
  })
  const tabviewStylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: -translationX.value,
        },
      ],
    }
  })

  // functions
  const handleTabPress = (index: number) => () => {
    translationX.value = withTiming(index * dimentions.width)
  }

  return (
    <View>
      <View className="flex-row shadow-sm bg-white">
        {HomeTabList.map((item, index) => (
          <Tab
            key={index}
            onPress={handleTabPress(index)}
            data={item}
            {...{ translationX, index }}
          />
        ))}
      </View>
      <Animated.View style={dividerStylez} className="h-[2px] bg-primary-500 w-1/2" />

      <Animated.View className="flex-row flex-auto" style={tabviewStylez}>
        <View className="w-[100vw] h-[100vw]">
          {rootStore.currencyStore.currencies.map((item, index, { length }) => (
            <TokenItem data={item} key={index} hideDivider={index === length - 1} />
          ))}
        </View>
      </Animated.View>
    </View>
  )
})

interface TabProps extends TouchableOpacityProps {
  translationX: SharedValue<number>
  index: number
  data: HomeTab
}

function Tab(props: TabProps) {
  const { translationX, index, data, ...rest } = props

  // animated hooks
  const dimentions = useWindowDimensions()
  const textStylez = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        translationX.value,
        [index - 1, index, index + 1].map((item) => (item *= dimentions.width)),
        [colors.gray[500], colors.primary[500], colors.gray[500]],
      ),
    }
  })

  return (
    <TouchableOpacity className="w-[50vw]" {...rest}>
      <View className="flex py-4 items-center">
        <Animated.Text style={[textStylez, $baseStyle]}>{translate(data.name)}</Animated.Text>
      </View>
    </TouchableOpacity>
  )
}

interface TokenItemProps {
  data: Currency
  hideDivider: boolean
}

const TokenItem: FC<TokenItemProps> = observer(function (props) {
  // hooks
  const rootStore = useStores()
  const { data, hideDivider } = props
  const balance = rootStore.walletStore.getBalanceByCurrencyId(data.id)

  return (
    <>
      <View className="flex-row items-center px-3 py-4">
        <Image source={{ uri: data.image }} className="w-[50px] aspect-square rounded-full" />
        <View className="flex-auto px-3">
          <View className="flex-1 justify-center">
            <Text>{data.name}</Text>
          </View>
        </View>
        <Text>
          {balance.native} {data.shortName}
        </Text>
      </View>
      {hideDivider ? null : <Divider className="ml-[74px] h-[0.5px]" />}
    </>
  )
})
