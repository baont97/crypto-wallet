import { observer } from "mobx-react-lite"
import React, { FC, useRef } from "react"
import { TouchableOpacity, View } from "react-native"
import colors from "tailwindcss/colors"
import { Button, Icon, IconTypes, Text } from "../../components"
import { TxKeyPath } from "../../i18n"
import { AppStackParamList } from "../../navigators"
import { spacing } from "../../theme"

interface HomeAction {
  key: keyof AppStackParamList
  name: TxKeyPath
  icon: IconTypes
}

interface HomeActionsProps {}

export const HomeActions: FC<HomeActionsProps> = observer(function () {
  const actions = useRef<HomeAction[]>([
    {
      key: "Send",
      name: "home.actions.send",
      icon: "send",
    },
    {
      key: "Receive",
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

  return (
    <View className="items-center m-[2vh] flex-row">
      {actions.current.map((item, index) => (
        <ActionButton key={index} data={item} />
      ))}
    </View>
  )
})

interface ActionButtonProps {
  data: HomeAction
}

const ActionButton: FC<ActionButtonProps> = observer(function ({ data }) {
  return (
    <TouchableOpacity className="flex-1 aspect-square">
      <View className="items-center flex-1 justify-center">
        <Icon icon={data.icon} color={colors.white} size={spacing.extraLarge} />
        <Text tx={data.name} className="text-white text-[12] mt-2" />
      </View>
    </TouchableOpacity>
  )
})
