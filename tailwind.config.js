const fontFamily = require("./plugins/extends-varibles/font-family.js")
const colors = require("./plugins/extends-varibles/colors.js")
let tailwindColors = require("tailwindcss/colors")

// tailwind.config.js
module.exports = {
  content: [
    "./app/components/*.{js,jsx,ts,tsx}",
    "./app/components/**/*.{js,jsx,ts,tsx}",
    "./ignite/**/*.{js,jsx,ts,tsx}",
    "./app/screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: { ...tailwindColors, ...colors },
      fontFamily,
    },
  },
  plugins: [require("./plugins/tint-color.js"), require("./plugins/font-family.js")],
}
