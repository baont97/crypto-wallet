import { ImageSourcePropType } from "react-native"
import { images } from "../../../assets"

interface WelcomeItem {
  id: number
  image: ImageSourcePropType
  title: string
  subTitle: string
}

export const WelcomeItems: WelcomeItem[] = [
  {
    id: 0,
    image: images.welcome.intro1,
    title: "A crypto wallet\nyou'll love",
    subTitle:
      "Makes it safe & easy for you to store, send, receive, stake, and swap tokens on the Solana blockchain",
  },
  {
    id: 0,
    image: images.welcome.intro2,
    title: "NFTs and\nCollectibles",
    subTitle: "We’ve taken special care to make sure your NFTs look great!",
  },
  {
    id: 0,
    image: images.welcome.intro3,
    title: "Your privacy is\nrespected",
    subTitle:
      "wallet doesn’t track any personal identifiable information, your account addresses or asset balances.",
  },
]
