import { SearchBarProps } from "react-native-screens"
import { CurrenciesProps } from "../../components"
import Config from "../../config"
import { translate } from "../../i18n"
import { colors } from "../../theme"

export const useHeaderSearchbar = (
  currenciesRef: React.MutableRefObject<React.FC<CurrenciesProps>>,
) => {
  const headerSearchBarOptionsBase: SearchBarProps = {
    // search bar options
    onChangeText: (event) =>
      currenciesRef?.current?.["search"] &&
      currenciesRef?.current?.["search"](event.nativeEvent.text),
    placeholder: translate("input.search.placeholder"),
  }

  const headerSearchBarOptionsIOS: SearchBarProps = {
    ...headerSearchBarOptionsBase,
    hintTextColor: colors.white,
    headerIconColor: colors.white,
    barTintColor: colors.white,
    hideWhenScrolling: false,
    tintColor: colors.black,
  }

  const headerSearchBarOptionsAndroid: SearchBarProps = {
    ...headerSearchBarOptionsBase,
    hintTextColor: colors.white,
    headerIconColor: colors.white,
    tintColor: colors.white,
    textColor: colors.white,

    barTintColor: colors.primary[500],
    shouldShowHintSearchIcon: false,
    onCancelButtonPress: (e) => e.preventDefault(),
    obscureBackground: true,
    disableBackButtonOverride: false,
  }

  const headerSearchBarOptions: SearchBarProps = Config.isIOS
    ? headerSearchBarOptionsIOS
    : headerSearchBarOptionsAndroid

  return headerSearchBarOptions
}

export type UseHeaderSearchbarResult = ReturnType<typeof useHeaderSearchbar>
