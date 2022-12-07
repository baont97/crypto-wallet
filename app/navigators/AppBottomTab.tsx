import React from "react"
import { createBottomTabNavigator, BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { observer } from "mobx-react-lite"
import { Icon, Text } from "../components"
import { spacing } from "../theme"
import { HomeStack } from "./HomeStack"
import Config from "../config"
import { SettingsStack } from "./SettingsStack"

export type AppBottomTabParamList = {
  HomeStack: undefined
  SettingsStack: undefined
}

export type AppBottomTabScreenProps<T extends keyof AppBottomTabParamList> = BottomTabScreenProps<
  AppBottomTabParamList,
  T
>

const BottomTab = createBottomTabNavigator<AppBottomTabParamList>()

export const AppBottomTab = observer(function AppBottomTab() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarStyle: { paddingVertical: spacing.small, minHeight: Config.isIOS ? 100 : 65 },
      }}
    >
      <BottomTab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => <Icon icon="wallet" {...{ color, size }} />,
          tabBarLabel: ({ color }) => <Text style={{ color }} tx="navigators.screenName.home" />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ color, size }) => <Icon icon="settings" {...{ color, size }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color }} tx="navigators.screenName.settings" />
          ),
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  )
})
