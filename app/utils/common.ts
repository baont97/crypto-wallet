import { Address } from "../models"

export const debounce = (cb, d) => {
  let timer
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      cb(...args)
    }, d)
  }
}

export const getAddressByChain = (chain: string, addresses: Address[]) => {
  return addresses.find((item) => item.chain === chain)
}
