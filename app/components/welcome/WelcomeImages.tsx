import React from "react"
import { Dimensions, Image, useWindowDimensions, View } from "react-native"
import { Text } from "../Text"
import { WelcomeItems } from "./WelcomeImages.types"
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import { colors } from "../../theme"

export interface WelcomeImageScrollViewProps {}

export function WelcomeImageScrollView({}: WelcomeImageScrollViewProps) {
  const dimensions = useWindowDimensions()
  const translationX = useSharedValue(0)

  const IMG_WIDTH = dimensions.height / 2.5

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationX.value = event.contentOffset.x
  })

  return (
    <View>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {WelcomeItems.map((x, i) => (
          <View key={i} className="w-screen">
            <View className="items-center">
              <Image style={{ width: IMG_WIDTH, height: IMG_WIDTH }} source={x.image} />
            </View>
            <View className="p-6 flex-auto">
              <Text preset="bold" className="mb-2" size="xxl">
                {x.title}
              </Text>
              <Text>{x.subTitle}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      <View className="flex-row items-center justify-center w-creen">
        {WelcomeItems.map((_, index) => {
          return <PagingItem key={index} {...{ translationX, index }} />
        })}
      </View>
    </View>
  )
}

interface PagingItemProps {
  translationX: SharedValue<number>
  index: number
}

function PagingItem({ translationX, index }: PagingItemProps) {
  const width = useWindowDimensions().width

  const stylez = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        translationX.value / width,
        [index - 1, index, index + 1],
        [colors.gray[300], colors.primary[500], colors.gray[300]],
      ),
    }),
    [translationX],
  )

  return <Animated.View className="w-2 aspect-square rounded mx-1" style={stylez} />
}
