import React, { FC, ForwardedRef, ForwardRefRenderFunction, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  FlatList,
  Image,
  ImageStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"
import { Currency, useStores } from "../../models"
import { Text } from "../Text"
import { Divider } from "../Divider"
import { debounce } from "../../utils/common"
import { EmptyState } from "../EmptyState"
import { images } from "../../../assets"
import { web3 } from "../../utils/web3"

export interface CurrenciesProps {
  onItemPress: (currency: Currency) => void
  filterFunct: (x: Currency, y: number, z: []) => boolean
  ref: React.Ref<typeof Currencies>
}

export const Currencies: FC<CurrenciesProps> = observer(
  React.forwardRef(function (
    { onItemPress, filterFunct }: CurrenciesProps,
    ref: React.Ref<typeof Currencies>,
  ) {
    const rootStore = useStores()

    // states
    const _keyword = useState<string>("")

    // functions
    const search = (key: string) => {
      debounce(() => _keyword[1](key), 500)()
    }

    // effects
    useEffect(() => {
      Object.assign(ref, {
        current: { search },
      })
    }, [search])

    return (
      <FlatList
        data={
          rootStore.currencyStore.filterCurrencies(_keyword[0]).filter(filterFunct) as Currency[]
        }
        keyExtractor={(_, index) => index + ""}
        renderItem={({ item }) => {
          return <CurrencyItem data={item} onPress={() => onItemPress(item)} />
        }}
        ItemSeparatorComponent={() => <Divider className="ml-[70px] h-[0.5px]" />}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          <EmptyState
            content="No tokens found"
            imageSource={images.emptyState.emptyBox}
            imageStyle={$emptyStateImage}
            style={$emptyStateContainer}
          />
        }
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
          {web3.ether.bigNumberFormatUnits(
            web3.ether.bigNumberParseUnits(balance.native + "", data.decimals),
            data.decimals,
          )}{" "}
          {data.shortName}
        </Text>
      </View>
    </TouchableOpacity>
  )
})

const $emptyStateContainer: ViewStyle = {
  padding: 30,
}

const $emptyStateImage: ImageStyle = {
  width: 72,
  height: 72,
}
