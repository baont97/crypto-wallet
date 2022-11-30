const plugin = require("tailwindcss/plugin")

const fontFamily = plugin(function ({ addUtilities, theme }) {
  const fontFamily = theme("fontFamily")

  let utils = {}

  Object.keys(fontFamily).forEach((_typo) => {
    utils[`.font-family-${_typo}`] = {
      fontFamily: [fontFamily[_typo]],
    }
  })

  addUtilities(utils)
})

module.exports = fontFamily
