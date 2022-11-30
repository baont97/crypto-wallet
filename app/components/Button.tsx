import React, { ComponentType } from "react"
import { styled } from "nativewind"
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"
import { colors, spacing, typography } from "../theme"
import { Text, TextProps } from "./Text"

type Presets = keyof typeof $viewPresets

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
}

export interface ButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override useful for "disabled" state.
   */
  disabledStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: Presets
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * Children components.
   */
  children?: React.ReactNode
  /**
   * Show an loading indicator
   */
  loading?: boolean
  /**
   * Loading activity indicator props
   */
  LoadingProps?: ActivityIndicatorProps
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Button.md)
 */
function _Button(props: ButtonProps) {
  const {
    tx,
    text,
    loading,
    txOptions,
    style: $viewStyleOverride,
    disabledStyle: $disabledViewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    LoadingProps,
    ...rest
  } = props

  const preset: Presets = $viewPresets[props.preset] ? props.preset : "default"
  function $viewStyle({ pressed }) {
    return [
      $viewPresets[preset],
      $viewStyleOverride,
      !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
      !!rest.disabled && [$disabledViewPresets[preset], $disabledViewStyleOverride],
    ]
  }
  function $textStyle({ pressed }) {
    return [
      $textPresets[preset],
      $textStyleOverride,
      !!pressed && [$pressedTextPresets[preset], $pressedTextStyleOverride],
    ]
  }

  return (
    <Pressable style={$viewStyle} accessibilityRole="button" {...rest}>
      {(state) =>
        loading ? (
          <ActivityIndicator size="small" {...$loadingPresets[preset]} {...LoadingProps} />
        ) : (
          <>
            {!!LeftAccessory && (
              <LeftAccessory style={$leftAccessoryStyle} pressableState={state} />
            )}

            <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle(state)}>
              {children}
            </Text>

            {!!RightAccessory && (
              <RightAccessory style={$rightAccessoryStyle} pressableState={state} />
            )}
          </>
        )
      }
    </Pressable>
  )
}

export const Button = styled<
  ButtonProps,
  "style" | "pressedStyle" | "textStyle" | "pressedTextStyle",
  any
>(_Button, {
  props: {
    style: true,
    pressedStyle: true,
    textStyle: true,
    pressedTextStyle: true,
  },
})

const $baseViewStyle: ViewStyle = {
  minHeight: 56,
  borderRadius: spacing.extraSmall,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingVertical: spacing.small,
  paddingHorizontal: spacing.small,
  overflow: "hidden",
}

const $baseTextStyle: TextStyle = {
  fontSize: 16,
  lineHeight: 20,
  fontFamily: typography.primary.medium,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
  color: colors.primary[500],
}

const $rightAccessoryStyle: ViewStyle = { marginStart: spacing.extraSmall, zIndex: 1 }
const $leftAccessoryStyle: ViewStyle = { marginEnd: spacing.extraSmall, zIndex: 1 }

const $viewPresets = {
  default: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.primary[400],
      backgroundColor: colors.primary[100],
    },
  ] as StyleProp<ViewStyle>,

  filled: [$baseViewStyle, { backgroundColor: colors.primary[500] }] as StyleProp<ViewStyle>,

  reversed: [$baseViewStyle, { backgroundColor: colors.primary[800] }] as StyleProp<ViewStyle>,

  clear: [$baseViewStyle, { backgroundColor: colors.transparent }] as StyleProp<ViewStyle>,
}

const $textPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: $baseTextStyle,
  filled: [$baseTextStyle, { color: colors.white }],
  reversed: [$baseTextStyle, { color: colors.primary[100] }],
  clear: [$baseTextStyle, { color: colors.black }],
}

const $pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { backgroundColor: colors.primary[200] },
  filled: { backgroundColor: colors.primary[400] },
  reversed: { backgroundColor: colors.primary[700] },
  clear: { backgroundColor: colors.black[50] },
}

const $disabledViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { backgroundColor: colors.gray[300] },
  filled: { backgroundColor: colors.gray[300] },
  reversed: { backgroundColor: colors.gray[300] },
  clear: { backgroundColor: colors.gray[300] },
}

const $pressedTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: { opacity: 0.9 },
  filled: { opacity: 0.9 },
  reversed: { opacity: 0.9 },
  clear: { opacity: 0.9 },
}

const $loadingPresets: Record<Presets, ActivityIndicatorProps> = {
  default: { color: colors.primary[500] },
  filled: { color: colors.white },
  reversed: { color: colors.white },
  clear: { color: colors.primary[500] },
}
