import tailwindExtendsColors from "../../plugins/extends-varibles/colors.js"
import tailwindBaseColors from "tailwindcss/colors"
import { DefaultColors } from "tailwindcss/types/generated/colors"

interface Colors extends DefaultColors {
  background: "#f2f2f6"
  primary: {
    50: "#f5f9fa"
    100: "#e0f1fc"
    200: "#bcddf9"
    300: "#8ebcee"
    400: "#5f96e1"
    500: "#4473b5"
    600: "#3d56c2"
    700: "#30419f"
    800: "#222c73"
    900: "#131b49"
  }
}

/**
 * remove depclared colors
 */

delete tailwindBaseColors["lightBlue"]
delete tailwindBaseColors["warmGray"]
delete tailwindBaseColors["trueGray"]
delete tailwindBaseColors["coolGray"]
delete tailwindBaseColors["blueGray"]

export const colors: Colors = {
  ...tailwindBaseColors,
  ...tailwindExtendsColors,
}
