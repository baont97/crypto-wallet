import { styled } from "nativewind"
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  Animated,
  Easing,
} from "react-native"
import { spacing } from "../../theme"

import Config from "../../config"

export interface PasscodeInputProps extends TextInputProps {
  /**
   * An optional style override useful for padding & margin.
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * A callback function when passcode is fullfiled
   */
  onDone: (passcode: string) => void
}

const _PasscodeInput = React.forwardRef(function (
  props: PasscodeInputProps,
  ref: React.Ref<TextInput>,
) {
  const { containerStyle, onDone, ...rest } = props

  // refs
  const shakeAnimationValue = useRef<Animated.Value>(new Animated.Value(0))

  // states
  const _value = useState<string>("")

  // callbacks
  const shake = useCallback(() => {
    shakeAnimationValue.current.setValue(0)
    Animated.timing(shakeAnimationValue.current, {
      duration: 375,
      toValue: 3,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    if (ref["current"]) {
      ref["current"]["clearData"] = () => _value[1]("")
      ref["current"]["shake"] = shake
    }
  }, [ref])

  useEffect(() => {
    if (_value[0]?.length === Config.passcodeLength) {
      onDone(_value[0])
    }
  }, [_value[0]])

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateX: shakeAnimationValue.current.interpolate({
              inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
              outputRange: [0, -15, 0, 15, 0, -15, 0],
            }),
          },
        ],
      }}
    >
      <View style={[$baseViewStyle, containerStyle]}>
        <TextInput
          ref={ref}
          className="absolute left-0 top-0 right-0 bottom-0 z-10 opacity-0"
          value={_value[0]}
          onChangeText={_value[1]}
          maxLength={Config.passcodeLength}
          keyboardType="number-pad"
          {...rest}
        />

        <View className="flex-row items-center justify-center flex-auto">
          {Array.from({ length: Config.passcodeLength }).map((_, index) => {
            const isHasData = Boolean((_value[0] || "")[index])
            return (
              <View
                className={`${isHasData ? "h-4" : "h-1"} w-4 mx-3 rounded-full bg-black`}
                key={index}
              />
            )
          })}
        </View>
      </View>
    </Animated.View>
  )
})

export const PasscodeInput = styled<PasscodeInputProps, "style" | "containerStyle", any>(
  _PasscodeInput,
  {
    props: {
      style: true,
      containerStyle: true,
    },
  },
)

const $baseViewStyle: ViewStyle = {
  height: spacing.huge,
}
