import { TxKeyPath } from "../../i18n"

export interface HomeTab {
  id: number
  name: TxKeyPath
}

export const HomeTabs: HomeTab[] = [
  {
    id: 0,
    name: "home.tabs.token",
  },
  {
    id: 1,
    name: "home.tabs.nft",
  },
]

export interface ElementPosition {
  x: number
  y: number
  width: number
  height: number
}
