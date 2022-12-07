import React, { ComponentType } from "react"
import { styled } from "nativewind"
import { View, ViewStyle, ViewProps, StyleProp, StyleSheet } from "react-native"
import { colors } from "../theme"

export interface DividerProps extends ViewProps {}

const StyledView = styled(View, "bg-neutral-300 h-[0.5]")

function _Divider(props: DividerProps) {
  const { style: $viewStyleOverride, ...rest } = props

  return <StyledView style={$viewStyleOverride} accessibilityRole="button" {...rest} />
}

export const Divider = styled<DividerProps, "style", any>(_Divider, {
  props: {
    style: true,
  },
})
