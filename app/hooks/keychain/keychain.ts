import { useEffect, useState } from "react"
import { save, load, reset } from "../../utils/keychain"
import BcryptReactNative from "bcrypt-react-native"

const saltRounds = 10

export type KeychainService = "PASSCODE" | "NONE" | string
export type KeychainData = { username: string; password: string }
export type SaveParams = { password: string; dateTime: string; service?: string }
export type CompareParams = {
  plainPassword: string
  hash: string
}

export type UseKeychainProps = {
  service: KeychainService
  needHash: boolean
}

export type UseKeychainResult = {
  data: KeychainData
  save: (params: SaveParams) => Promise<void>
  compare: (params: CompareParams) => Promise<boolean>
  reset: () => Promise<boolean>
  load: () => Promise<KeychainData>
  reLoad: () => void
}

const DefaultData: KeychainData = { username: "", password: "" }

export const useKeychain = (props: UseKeychainProps): UseKeychainResult => {
  const formatService = (raw: string) => (raw || "").replace(/[^\w\s]/gi, "").toUpperCase()

  const _data = useState<KeychainData>(DefaultData)
  const service = formatService(props.service)

  const boostrapAsync = () => {
    if (service !== "NONE") load(service).then(_data[1])
    else _data[1](DefaultData)
  }

  const hashAndSave = async (password: string, dateTime: string, serviceOverride?: string) => {
    const _service = formatService(serviceOverride)

    if (props.needHash) {
      const salt = await BcryptReactNative.getSalt(saltRounds)
      const hash = await BcryptReactNative.hash(salt, password)
      await save(hash, dateTime, _service || service)
    } else {
      await save(password, dateTime, _service || service)
    }
  }

  const compare = async (params: CompareParams) => {
    const matched = await BcryptReactNative.compareSync(params.plainPassword, params.hash)

    return Boolean(matched)
  }

  useEffect(() => {
    boostrapAsync()
  }, [service])

  return {
    save: (params: SaveParams) => hashAndSave(params.password, params.dateTime, params.service),
    load: () => load(service),
    reset: () => reset(service),
    compare,
    reLoad: boostrapAsync,
    data: _data[0],
  }
}
