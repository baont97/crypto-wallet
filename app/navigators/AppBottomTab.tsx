import React from "react"
import { createBottomTabNavigator, BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { observer } from "mobx-react-lite"
import { HomeScreen } from "../screens"
import { SettingsScreen } from "../screens/SettingsScreen"
import { Icon, Text } from "../components"
import { spacing } from "../theme"
import { HomeStack } from "./HomeStack"

export type AppBottomTabParamList = {
  HomeStack: undefined
  Settings: undefined
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
        tabBarStyle: { paddingVertical: spacing.small, minHeight: 100 },
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
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon icon="settings" {...{ color, size }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color }} tx="navigators.screenName.settings" />
          ),
        }}
      />
    </BottomTab.Navigator>
  )
})
