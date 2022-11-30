import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { AppStackScreenProps } from "../../navigators"

export const SendScreen: FC<AppStackScreenProps<"Send">> = observer(function () {
  return <Screen></Screen>
})
