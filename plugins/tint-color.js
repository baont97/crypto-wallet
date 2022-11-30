const plugin = require("tailwindcss/plugin")

const tintColor = plugin(function ({ addUtilities, theme }) {
  const colors = theme("colors")
  let utils = {}

  Object.keys(colors).forEach((_color) => {
    Object.keys(colors[_color]).forEach((x) => {
      utils[`.tint-color-${_color}-${x}`] = {
        tintColor: colors[_color][x],
      }
    })
  })

  addUtilities(utils)
})

module.exports = tintColor
