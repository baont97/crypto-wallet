import { Theme } from "@react-navigation/native"
import { colors } from "./colors"

export const navigationTheme: { [key in "dark" | "light"]: Theme } = {
  light: {
    dark: false,
    colors: {
      primary: colors.primary[500],
      background: colors.white,
      card: colors.white,
      text: colors.black,
      border: colors.gray[700],
      notification: colors.red[500],
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: colors.primary[500],
      background: colors.black,
      card: colors.white,
      text: colors.white,
      border: colors.gray[200],
      notification: colors.red[500],
    },
  },
}
