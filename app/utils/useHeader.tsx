import React, { useLayoutEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { Header, HeaderProps } from "../components"
import { StackNavigationOptions } from "@react-navigation/stack"
import { translate, TxKeyPath } from "../i18n"
import { typography } from "../theme"

export function useHeader(headerProps: HeaderProps, deps: any[] = []) {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <Header {...headerProps} />,
    })
  }, deps)
}

export interface UseHeaderOption extends Partial<StackNavigationOptions> {
  headerBackTitleTx?: TxKeyPath
  titleTx?: TxKeyPath
}

export function useHeaderOption(opts: UseHeaderOption, deps: any[] = []) {
  const navigation = useNavigation()

  const headerBackTitle = opts.headerBackTitleTx
    ? translate(opts.headerBackTitleTx)
    : opts.headerBackTitle

  const title = opts.titleTx ? translate(opts.titleTx) : opts.title

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle,
      title,
      headerTitleStyle: { fontFamily: typography.primary.medium },
      headerBackTitleStyle: { fontFamily: typography.primary.medium },
      headerShadowVisible: false,
      ...opts,
    })
  }, deps)
}
