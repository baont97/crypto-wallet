import React, { FC, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  RefreshControl,
  useWindowDimensions,
  View,
  StatusBar,
  TouchableOpacityProps,
  TouchableOpacity,
} from "react-native"
import { $baseStyle, Button, Icon, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { useHeaderOption } from "../../utils/useHeader"
import { HomeActions } from "./HomeActions"
import { HomeTabs } from "./HomeTabs"
import { HomeStackScreenProps } from "../../navigators/HomeStack"
import { getDefaultHeaderHeight, useHeaderHeight } from "@react-navigation/elements"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { HomeTabs as HomeTabList, HomeTab } from "./HomeScreen.types"
import { ElementPosition } from "./HomeScreen.types"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { translate } from "../../i18n"
import { ScrollView } from "react-native-gesture-handler"

import i18n from "i18n-js"
import Config from "../../config"

export const HomeScreen: FC<HomeStackScreenProps<"Home">> = observer(function ({ navigation }) {
  // hooks
  const rootStore = useStores()
  const insets = useSafeAreaInsets()

  // states
  const _tabPosition = useState<ElementPosition>()
  const _balancePosition = useState<ElementPosition>()

  // navigators
  const headerHeight = useHeaderHeight()
  const bottomTabBarHeight = useBottomTabBarHeight()
  const dimentions = useWindowDimensions()

  // animated
  const translationY = useSharedValue(0)
  const translationX = useSharedValue(0)

  // refs
  const tabViewRef = useRef<View>()
  const scrollViewRef = useRef<ScrollView & Animated.ScrollView>()
  const previousScrollOffsetY = useRef<number>(0)

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        translationY.value = e.contentOffset.y
      },
    },
    [_tabPosition[0], scrollViewRef.current],
  )

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

  const $viewStylez = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translationY.value,
      [0, 10, 20],
      [colors.primary[500], colors.primary[500], colors.white],
    ),
  }))

  const $tabViewStylez = useAnimatedStyle(
    () => ({
      top: Math.round(_tabPosition[0]?.y) - Math.round(headerHeight) || 0,
      width: _tabPosition[0]?.width || 0,
      height: _tabPosition[0]?.height || 0,
      transform: [
        {
          translateY: Math.max(
            -translationY.value,
            -(_tabPosition[0]?.y - Math.round(headerHeight)) || 0,
          ),
        },
      ],
    }),
    [_tabPosition[0], headerHeight],
  )

  const $headerTextStylez = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        translationY.value,
        [0, _balancePosition[0]?.height || 0, _balancePosition[0]?.height * 2 || 0],
        [0, 0, 1],
      ),
    }),
    [_balancePosition[0]],
  )

  // navigators
  useHeaderOption(
    {
      headerTintColor: colors.white,
      header: (props) => {
        return (
          <View
            style={{
              height:
                getDefaultHeaderHeight(dimentions, false, StatusBar.currentHeight) +
                (Config.isIOS ? insets.top : 0),
            }}
            className="bg-primary-500 flex-row items-end"
          >
            <View className="basis-1/5 items-start">
              <Button
                preset="clear"
                LeftAccessory={() => <Icon icon="bell" color={props?.options.headerTintColor} />}
              />
            </View>
            <Animated.View
              className="items-center justify-center basis-3/5 h-full"
              style={[{ paddingTop: insets.top }, $headerTextStylez]}
            >
              <Text className="text-white font-medium text-lg">
                ${i18n.toCurrency(rootStore.walletStore.totalBalanceInFiat, { unit: "" })}
              </Text>
            </Animated.View>
            <View className="basis-1/5" />
          </View>
        )
      },
    },
    [insets, rootStore.walletStore.totalBalanceInFiat],
  )

  // memos
  const minHeight = useMemo(
    () => dimentions.height - headerHeight - bottomTabBarHeight,
    [headerHeight, bottomTabBarHeight, dimentions.height],
  )

  // functions
  const handleTabPress = (index: number) => () => {
    translationX.value = withTiming(index * dimentions.width)
  }
  const handleWalletPress = () => {}

  // components
  const renderTabs = () => (
    <>
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
    </>
  )

  return (
    <Screen preset="fixed" statusBarStyle="light">
      <Animated.View style={$viewStylez} className="flex-auto">
        {_tabPosition[0] ? (
          <Animated.View
            style={[
              {
                position: "absolute",
                zIndex: 10,
                right: 0,
                left: 0,
              },
              $tabViewStylez,
            ]}
          >
            {renderTabs()}
          </Animated.View>
        ) : null}
        <Animated.ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl tintColor={colors.white} refreshing={false} onRefresh={() => {}} />
          }
          onScrollEndDrag={(e) => {
            if (scrollViewRef.current) {
              const isScrollDown = e.nativeEvent.contentOffset.y > _balancePosition[0].height
              const nextScrollOffsetY = isScrollDown ? _tabPosition[0].y : 0
              scrollViewRef.current.scrollTo({
                y: nextScrollOffsetY,
              })
              previousScrollOffsetY.current = nextScrollOffsetY
            }
          }}
        >
          <View className="items-center justify-center bg-primary-500">
            <Text
              className="text-white font-family-medium text-3xl"
              onLayout={(e) => _balancePosition[1](e.nativeEvent.layout)}
            >
              ${i18n.toCurrency(rootStore.walletStore.totalBalanceInFiat, { unit: "" })}
            </Text>
            <Text onPress={handleWalletPress} className="text-white">
              {rootStore.walletStore.activeWallet.name}
            </Text>

            <HomeActions />
          </View>

          <View className="bg-white rounded-t-md w-[100vw]" style={{ minHeight: minHeight }}>
            <View
              ref={tabViewRef}
              onLayout={() => {
                tabViewRef.current.measureInWindow((x, y, width, height) => {
                  _tabPosition[1]({ x, y, width, height })
                })
              }}
            >
              {renderTabs()}
            </View>

            <HomeTabs />
          </View>
        </Animated.ScrollView>
      </Animated.View>
    </Screen>
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
