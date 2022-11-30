import React from "react"
import { Pressable, PressableProps, View } from "react-native"
import { Icon, IconTypes } from "./Icon"
import { Text, TextProps } from "./Text"
import { styled } from "nativewind"
import { spacing } from "../theme"
import { TxKeyPath } from "../i18n"
import { Divider } from "./Divider"

interface RowItemProps {
  // left
  left?: string
  leftTx?: TxKeyPath
  iconLeftType?: IconTypes

  leftTextProps?: TextProps

  // divider
  hideDivider?: boolean

  // press props
  onPress?: () => void
  pressProps?: PressableProps
}

function _RowItem({
  left,
  leftTx,
  iconLeftType,
  leftTextProps,
  hideDivider,
  onPress,
  ...rest
}: RowItemProps) {
  return (
    <Pressable disabled={Boolean(!onPress)} {...{ onPress }} {...rest}>
      <View className="flex-row items-center px-6 py-4">
        <View className="flex-auto">
          {Boolean(iconLeftType) && (
            <Icon icon={iconLeftType} size={spacing.large} className="tint-color-gray-300" />
          )}
          <Text className="text-lg" tx={leftTx} {...leftTextProps}>
            {left}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Icon icon="caretRight" size={spacing.large} className="tint-color-gray-300" />
        </View>
      </View>

      {!hideDivider && <Divider className="ml-6" />}
    </Pressable>
  )
}

const RowItem = styled<RowItemProps, never, never>(_RowItem, {
  props: {},
})

export interface RowItemGroupProps {
  items: RowItemProps[]
}

function _RowItemGroup({ items }: RowItemGroupProps) {
  return (
    <View className="bg-gray-50 mx-6 rounded-xl overflow-hidden">
      {(items || []).map((x, i, { length }) => (
        <RowItem key={i} {...x} hideDivider={i === length - 1} />
      ))}
    </View>
  )
}

export const RowItemGroup = styled<RowItemGroupProps, never, never>(_RowItemGroup, {
  props: {},
})
