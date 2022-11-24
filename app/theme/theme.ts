import { Theme } from "@react-navigation/native"
import { createTheme } from "@rneui/themed"

export const theme = createTheme({
  lightColors: {},
  darkColors: {},
  components: {},
})

export const navigationTheme: { [key in "dark" | "light"]: Theme } = {
  light: {
    dark: false,
    colors: {
      primary: theme.lightColors.primary,
      background: theme.lightColors.background,
      card: theme.lightColors.secondary,
      text: theme.lightColors.black,
      border: theme.lightColors.divider,
      notification: theme.lightColors.error,
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: theme.darkColors.primary,
      background: theme.darkColors.background,
      card: theme.darkColors.secondary,
      text: theme.darkColors.black,
      border: theme.darkColors.divider,
      notification: theme.darkColors.error,
    },
  },
}
