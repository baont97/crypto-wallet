import { observer } from "mobx-react-lite"
import React, { FC, useRef, useState } from "react"
import { Screen, Text, PasscodeInput } from "../../components"
import { useKeychain } from "../../hooks"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import { useHeaderOption } from "../../utils/useHeader"

export const InputPasscodeScreen: FC<AppStackScreenProps<"InputPasscode">> = observer(function ({
  route,
  navigation,
}) {
  // hooks
  const passcodeHook = useKeychain({
    service: "PASSCODE",
    needHash: true,
  })

  // states
  const _isWrongConfirmPasscode = useState<boolean>(false)

  // refs
  const passcodeRef = useRef<string>("")

  // functions
  const resetState = () => {
    _isWrongConfirmPasscode[1](false)
    passcodeRef.current["clearData"]()
  }

  const passcodeCallback = async (input: string) => {
    const matched = await passcodeHook.compare({
      hash: passcodeHook.data.username,
      plainPassword: input,
    })
    if (!matched) {
      _isWrongConfirmPasscode[1](true)
      passcodeRef.current["clearData"]()
      passcodeRef.current["shake"]()
    } else {
      resetState()
      navigation.navigate(
        route.params.type === "createNewWallet" ? "GenerateSecretPhrase" : "ImportWallet",
        { password: input },
      )
    }
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle="flex-1 items-center justify-center"
      safeAreaEdges={["bottom"]}
      KeyboardAvoidingViewProps={{ enabled: false }}
    >
      <Text
        tx={
          _isWrongConfirmPasscode[0]
            ? "passcode.wrongPasscodeMessage"
            : "navigators.screenName.inputPasscode"
        }
      />
      <PasscodeInput ref={passcodeRef} onDone={passcodeCallback} autoFocus />
    </Screen>
  )
})
