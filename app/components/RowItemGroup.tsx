import React from "react"
import { Pressable, PressableProps, View, ViewProps } from "react-native"
import { Icon, IconProps, IconTypes } from "./Icon"
import { Text, TextProps } from "./Text"
import { styled } from "nativewind"
import { spacing } from "../theme"
import { TxKeyPath } from "../i18n"
import { Divider } from "./Divider"

interface RowItemProps {
  // left
  left?: string
  leftTx?: TxKeyPath
  leftTextProps?: TextProps

  // left
  right?: string
  rightTx?: TxKeyPath
  rightTextProps?: TextProps

  // divider
  hideDivider?: boolean

  // press props
  onPress?: () => void
  pressProps?: PressableProps

  // icon props
  iconLeftProps?: IconProps
  disabledLeftTintColor?: boolean

  // icon props
  iconRightProps?: IconProps
  disabledRightTintColor?: boolean
}

function _RowItem({
  left,
  leftTx,
  leftTextProps,
  right,
  rightTx,
  rightTextProps,
  hideDivider,
  onPress,
  iconLeftProps,
  disabledLeftTintColor,
  iconRightProps,
  disabledRightTintColor,
  ...rest
}: RowItemProps) {
  return (
    <Pressable disabled={Boolean(!onPress)} {...{ onPress }} {...rest}>
      <View className="flex-row items-center pl-6 pr-4 py-4">
        <View className="flex-auto flex-row items-center">
          {Boolean(iconLeftProps) && (
            <Icon
              size={spacing.large}
              className={`${disabledLeftTintColor ? "" : "tint-color-gray-300"} mr-4`}
              {...iconLeftProps}
            />
          )}
          <Text className="text-lg" tx={leftTx} {...leftTextProps}>
            {left}
          </Text>
        </View>

        <View className="flex-row items-center">
          {(Boolean(right) || Boolean(rightTx)) && (
            <Text className="text-gray-400" tx={rightTx} {...rightTextProps}>
              {right}
            </Text>
          )}
          <Icon
            icon="caretRight"
            size={spacing.large}
            className={disabledRightTintColor ? "" : "tint-color-gray-300"}
            {...iconRightProps}
          />
        </View>
      </View>

      {!hideDivider && <Divider className="ml-6" />}
    </Pressable>
  )
}

const RowItem = styled<RowItemProps, never, never>(_RowItem, {
  props: {},
})

export interface RowItemGroupProps extends ViewProps {
  items: RowItemProps[]
}

function _RowItemGroup(props: RowItemGroupProps) {
  const { items, ...rest } = props

  return (
    <View className="bg-gray-50 mx-6 rounded-xl overflow-hidden" {...rest}>
      {(items || []).map((x, i, { length }) => (
        <RowItem key={i} {...x} hideDivider={i === length - 1} />
      ))}
    </View>
  )
}

export const RowItemGroup = styled<RowItemGroupProps, never, never>(_RowItemGroup, {
  props: {
    style: true,
  },
})
