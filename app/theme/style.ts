import colors from "tailwindcss/colors"
import { StyleSheet } from "react-native"
import { typography } from "./typography"

export const persetStyles = StyleSheet.create({
  headerTextWhite: {
    fontFamily: typography.primary.medium,
    color: colors.white,
  },
})
