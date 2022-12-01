import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, TouchableOpacity, TouchableOpacityProps, View } from "react-native"
import { Currency, useStores } from "../../models"
import { Text } from "../Text"

import * as Web3Wallet from "react-native-web3-wallet"
import { Divider } from "../Divider"
import { debounce } from "../../utils/common"

export interface CurrenciesProps {
  onItemPress: (currency: Currency) => void
}

export const Currencies = observer(
  React.forwardRef(function ({ onItemPress }: CurrenciesProps, ref: React.Ref<typeof Currencies>) {
    const rootStore = useStores()

    // states
    const _keyword = useState<string>("")

    // functions
    const search = (key: string) => debounce(() => _keyword[1](key), 500)()

    // effects
    useEffect(() => {
      Object.assign(ref, {
        current: { search },
      })
    }, [search])

    return (
      <FlatList
        data={rootStore.currencyStore.filterCurrencies(_keyword[0]) as Currency[]}
        keyExtractor={(_, index) => index + ""}
        renderItem={({ item }) => {
          return <CurrencyItem data={item} onPress={() => onItemPress(item)} />
        }}
        ItemSeparatorComponent={() => <Divider className="ml-[70px] h-[0.5px]" />}
      />
    )
  }),
)

interface CurrencyItemProps extends TouchableOpacityProps {
  data: Currency
}

export const CurrencyItem: FC<CurrencyItemProps> = observer(function (props) {
  const { data, ...rest } = props

  const rootStore = useStores()
  const balance = rootStore.walletStore.getBalanceByCurrencyId(data.id)

  return (
    <TouchableOpacity {...rest}>
      <View className="flex-row items-center px-3 py-4">
        <Image source={{ uri: data.image }} className="w-[45px] aspect-square rounded-full" />
        <View className="flex-auto px-3">
          <View className="flex-1 justify-center">
            <Text>{data.name}</Text>
          </View>
        </View>

        <Text>
          {Web3Wallet.bigNumberFormatUnits(
            Web3Wallet.bigNumberParseUnits(balance.native + "", data.decimals),
            data.decimals,
          )}{" "}
          {data.shortName}
        </Text>
      </View>
    </TouchableOpacity>
  )
})
