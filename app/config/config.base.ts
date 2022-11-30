export interface ConfigBaseProps {
  persistNavigation: "always" | "dev" | "prod" | "never"
  catchErrors: "always" | "dev" | "prod" | "never"
  exitRoutes: string[]
  passcodeLength: number
  walletPath: string
  network: string
}

export type PersistNavigationConfig = ConfigBaseProps["persistNavigation"]

const BaseConfig: ConfigBaseProps = {
  // This feature is particularly useful in development mode, but
  // can be used in production as well if you prefer.
  persistNavigation: "dev",

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
   * Wallet path for create
   */
  walletPath: "m/44'/0'/0'/0/0",

  /**
   * Network
   */
  network: "https://goerli.infura.io/v3/a374100574a041818a4d3e3afaa41fad",
}

export default BaseConfig
