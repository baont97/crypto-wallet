import React, { FC, useMemo, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Screen, Text, RowItemGroup, Toggle, Button, PasscodeInput } from "../../components"
import { useKeychain } from "../../hooks"
import { TxKeyPath } from "../../i18n"
import { AppStackScreenProps } from "../../navigators"
import { delay } from "../../utils/delay"
import { formatDate } from "../../utils/formatDate"
import { useHeaderOption } from "../../utils/useHeader"
import { SetupPasscodeSteps } from "./PasscodeScreen.types"

export const SetupPasscodeScreen: FC<AppStackScreenProps<"SetupPasscode">> = ({
  route,
  navigation,
}) => {
  const passcodeHook = useKeychain({
    service: "PASSCODE",
    needHash: true,
  })

  // states
  const _step = useState<string>(SetupPasscodeSteps.create)
  const _isWrongConfirmPasscode = useState<boolean>(false)

  // refs
  const passcodeRef = useRef<string>("")
  const passcodeValueRef = useRef<string>("")

  const passcodeCallback = (input: string) => {
    delay(150).then(async () => {
      if (_step[0] === SetupPasscodeSteps.confirm) {
        if (input !== passcodeValueRef.current) {
          passcodeRef.current["clearData"]()
          _isWrongConfirmPasscode[1](true)
          passcodeRef.current["shake"]()
        } else {
          await passcodeHook.save({
            password: input,
            dateTime: new Date().toISOString(),
          })
          navigation.navigate(
            route.params.type === "createNewWallet" ? "GenerateSecretPhrase" : "ImportWallet",
            { password: input },
          )
        }
      } else {
        passcodeRef.current["clearData"]()
        passcodeValueRef.current = input
        _step[1](SetupPasscodeSteps.confirm)
      }
    })
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle="flex-1 items-center justify-center"
      safeAreaEdges={["bottom"]}
    >
      <Text
        tx={
          _isWrongConfirmPasscode[0]
            ? "passcode.wrongPasscodeMessage"
            : (`passcode.setupPasscode.step.${_step[0]}.label` as TxKeyPath)
        }
      />
      <PasscodeInput ref={passcodeRef} onDone={passcodeCallback} autoFocus />
      <Text tx="passcode.setupPasscode.hint" className="text-sm text-gray-400" />
    </Screen>
  )
}
