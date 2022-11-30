type SetupPasscodeStepName = "create" | "confirm"

export const SetupPasscodeSteps: {
  [key in SetupPasscodeStepName]: string
} = {
  create: "create",
  confirm: "confirm",
}
