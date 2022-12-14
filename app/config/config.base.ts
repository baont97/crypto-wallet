import { Platform } from "react-native"

export interface ConfigBaseProps {
  persistNavigation: "always" | "dev" | "prod" | "never"
  catchErrors: "always" | "dev" | "prod" | "never"
  exitRoutes: string[]
  passcodeLength: number
  network: string
  isIOS: boolean
  chainId: number
}

export type PersistNavigationConfig = ConfigBaseProps["persistNavigation"]

const BaseConfig: ConfigBaseProps = {
  // This feature is particularly useful in development mode, but
  // can be used in production as well if you prefer.
  persistNavigation: "never",

  /**
   * Only enable if we're catching errors in the right environment
   */
  catchErrors: "prod",

  /**
   * This is a list of all the route names that will exit the app if the back button
   * is pressed while in that screen. Only affects Android.
   */
  exitRoutes: ["Welcome"],

  /**
   * Max length of pass code
   */
  passcodeLength: 6,

  /**
   * Network
   */
  network: "https://goerli.infura.io/v3/a374100574a041818a4d3e3afaa41fad",

  /**
   * Platform
   */
  isIOS: Platform.OS === "ios",

  /**
   * Chain id of network
   */
  chainId: 5,
}

export default BaseConfig
