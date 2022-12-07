import * as React from "react"
import { ComponentType } from "react"
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  Image,
} from "react-native"
import { styled } from "nativewind"

export type IconTypes = keyof typeof iconRegistry

export interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
function _Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View
  const tintColor = color || StyleSheet.flatten([$imageStyle?.tintColor])?.["tintColor"]

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image
        style={[
          $imageStyle,
          tintColor && { tintColor },
          size && { width: size, height: size },
          $imageStyleOverride,
        ]}
        source={iconRegistry[icon]}
      />
    </Wrapper>
  )
}

export const Icon = styled<IconProps, "style" | "containerStyle", any>(_Icon, {
  props: {
    style: true,
    containerStyle: true,
  },
})

export const iconRegistry = {
  back: require("../../assets/icons/back.png"),
  bell: require("../../assets/icons/bell.png"),
  caretLeft: require("../../assets/icons/caretLeft.png"),
  caretRight: require("../../assets/icons/caretRight.png"),
  check: require("../../assets/icons/check.png"),
  clap: require("../../assets/icons/clap.png"),
  community: require("../../assets/icons/community.png"),
  components: require("../../assets/icons/components.png"),
  debug: require("../../assets/icons/debug.png"),
  github: require("../../assets/icons/github.png"),
  heart: require("../../assets/icons/heart.png"),
  hidden: require("../../assets/icons/hidden.png"),
  ladybug: require("../../assets/icons/ladybug.png"),
  lock: require("../../assets/icons/lock.png"),
  menu: require("../../assets/icons/menu.png"),
  more: require("../../assets/icons/more.png"),
  pin: require("../../assets/icons/pin.png"),
  podcast: require("../../assets/icons/podcast.png"),
  settings: require("../../assets/icons/settings.png"),
  slack: require("../../assets/icons/slack.png"),
  view: require("../../assets/icons/view.png"),
  x: require("../../assets/icons/x.png"),
  send: require("../../assets/icons/send.png"),
  receive: require("../../assets/icons/receive.png"),
  buy: require("../../assets/icons/buy.png"),
  swap: require("../../assets/icons/swap.png"),
  filter: require("../../assets/icons/filter.png"),
  wallet: require("../../assets/icons/wallet.png"),
  search: require("../../assets/icons/search.png"),
  copy: require("../../assets/icons/copy.png"),
  share: require("../../assets/icons/share.png"),
  qrScan: require("../../assets/icons/qr-scan.png"),
  plus: require("../../assets/icons/plus.png"),
  walletColorful: require("../../assets/icons/wallet-colorful.png"),
  info: require("../../assets/icons/info.png"),
}

const $imageStyle: ImageStyle = {
  resizeMode: "contain",
}
