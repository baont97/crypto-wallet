import React, { FC, useRef } from "react"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, View, TouchableOpacityProps } from "react-native"
import { Icon, IconTypes, Text } from "../../components"
import { TxKeyPath } from "../../i18n"
import { AppStackParamList } from "../../navigators"
import { spacing } from "../../theme"

import colors from "tailwindcss/colors"
import { HomeStackParamList } from "../../navigators/HomeStack"

interface HomeAction {
  key: keyof AppStackParamList
  name: TxKeyPath
  icon: IconTypes
}

interface HomeActionsProps {}

export const HomeActions: FC<HomeActionsProps> = observer(function () {
  // hooks
  const navigation = useNavigation<NavigationProp<HomeStackParamList, "Home">>()

  // refs
  const actions = useRef<HomeAction[]>([
    {
      key: "SendStack",
      name: "home.actions.send",
      icon: "send",
    },
    {
      key: "ReceiveStack",
      name: "home.actions.receive",
      icon: "receive",
    },
    {
      key: "Buy",
      name: "home.actions.buy",
      icon: "buy",
    },
    {
      key: "Swap",
      name: "home.actions.swap",
      icon: "swap",
    },
  ])

  // functions
  const handleItemPress = ({ key }: HomeAction) => navigation.getParent().navigate(key)

  return (
    <View className="items-center m-[2vh] flex-row">
      {actions.current.map((item, index) => (
        <ActionButton key={index} data={item} onPress={() => handleItemPress(item)} />
      ))}
    </View>
  )
})

interface ActionButtonProps extends TouchableOpacityProps {
  data: HomeAction
}

const ActionButton: FC<ActionButtonProps> = observer(function ({ data, ...rest }) {
  return (
    <TouchableOpacity className="flex-1 aspect-square" {...rest}>
      <View className="items-center flex-1 justify-center">
        <Icon icon={data.icon} color={colors.white} size={spacing.extraLarge} />
        <Text tx={data.name} className="text-white text-[12] mt-2" />
      </View>
    </TouchableOpacity>
  )
})
