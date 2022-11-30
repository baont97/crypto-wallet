import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { AppStackScreenProps } from "../../navigators"

export const ReciveScreen: FC<AppStackScreenProps<"Receive">> = observer(function () {
  return <Screen></Screen>
})
