import { styled } from "nativewind"
import React, { FC, useState } from "react"
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native"
import { colors, spacing } from "../theme"
import { debounce } from "../utils/common"
import { Button } from "./Button"
import { Icon } from "./Icon"
import { TextField, TextFieldProps } from "./TextField"

export interface SearchFieldProps extends TextFieldProps {
  style?: StyleProp<ViewStyle>
}

function _SearchField(props: SearchFieldProps) {
  const { style: $viewStyleOverride, ...rest } = props

  const $viewStyle = [$viewStyleOverride]

  // states
  const _editting = useState<boolean>(false)

  // functions
  const handleChange = () => {
    _editting[1](true)
    debounce(() => _editting[1](false), 500)()
  }

  return (
    <View className="bg-primary-500 px-6 pb-2" style={$viewStyle}>
      <TextField
        LeftAccessory={() => (
          <Button
            className="min-h-0"
            preset="clear"
            LeftAccessory={() => (
              <View className="w-4 h-4">
                {_editting[0] ? (
                  <ActivityIndicator size="small" color={colors.gray[500]} />
                ) : (
                  <Icon icon="search" color={colors.gray[500]} size={spacing.medium} />
                )}
              </View>
            )}
          />
        )}
        inputWrapperStyle="bg-white m-h-0"
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e)
          }

          handleChange()
        }}
        {...rest}
      />
    </View>
  )
}

export const SearchField = styled(_SearchField, {
  props: {
    style: true,
  },
})
