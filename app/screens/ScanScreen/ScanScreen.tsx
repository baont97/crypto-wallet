import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Modal,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Button, EmptyState, Screen, Text } from "../../components"
import { Camera, CameraPermissionStatus, useCameraDevices } from "react-native-vision-camera"
import { useHeaderOption } from "../../utils/useHeader"
import { colors } from "../../theme"
import { RNHole, RNHoleView } from "react-native-hole-view"
import { useScanBarcodes, BarcodeFormat } from "vision-camera-code-scanner"
import { hooks } from "@baont97/vietnam-rn-utils"
import { useIsFocused } from "@react-navigation/native"
import { AppStackScreenProps } from "../../navigators"
import { SendStackScreenProps } from "../../navigators/SendStack"
import { HeaderBackButton } from "@react-navigation/elements"
import { SafeAreaView } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

const HoleSize = width / 1.5
const Hole: RNHole = {
  x: (width - HoleSize) / 2,
  y: (height - HoleSize) / 2,
  width: HoleSize,
  height: HoleSize,
  borderRadius: 2,
}

export const ScanScreen: FC<AppStackScreenProps<"Scan"> & SendStackScreenProps<"Scan">> = observer(
  function (props) {
    useHeaderOption({
      headerTransparent: true,
      headerTintColor: colors.white,
      headerTitle: "",
    })
    const isFocused = useIsFocused()
    const { from, additionParams } = props.route.params

    // refs
    const cameraRef = useRef<Camera>()
    const pauseScanRef = useRef<boolean>(false)
    const prevCodeRef = useRef<string>()

    // states
    const [cameraStatus, setCameraStatus] = useState<CameraPermissionStatus>()
    const [loading, setLoading] = useState<boolean>(false)

    useHeaderOption(
      {
        headerTintColor: cameraStatus === "denied" ? colors.black : colors.white,
        // statusBarStyle: cameraStatus === "denied" ? "dark" : "light",
      },
      [cameraStatus],
    )

    const devices = useCameraDevices()
    const device = devices.back
    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
      checkInverted: true,
    })

    hooks.common.useMount(() => {
      ;(async () => {
        let status = await Camera.getCameraPermissionStatus()
        if (status === "not-determined") {
          status = await Camera.requestCameraPermission()
        }
        setCameraStatus(status)
      })()
    })

    useEffect(() => {
      if (barcodes.length) {
        const qrcode = barcodes[0].content.data.toString()

        if (!pauseScanRef.current && qrcode !== prevCodeRef.current) {
          setLoading(true)
          pauseScanRef.current = true

          props.navigation.navigate(from as never, { qrcode, ...additionParams } as never)
        }
      }
    }, [barcodes])

    return (
      <Screen preset="fixed" contentContainerStyle={$container}>
        {!device || !isFocused ? (
          <EmptyState />
        ) : cameraStatus === "denied" ? (
          <View className="flex-1 items-center justify-center">
            <Text>Camera was disabled</Text>
            <Button
              preset="filled"
              className="min-h-[40] mt-4"
              text="Authorize"
              onPress={Linking.openSettings}
            />
          </View>
        ) : (
          <View style={$container}>
            <View style={$holeHeader}>
              <Text style={$holeTitle} tx="scanScreen.qrcode" />
            </View>
            <RNHoleView style={$holeView} holes={[Hole]} />
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              frameProcessorFps={5}
              isActive
              {...{ frameProcessor, device }}
            />
          </View>
        )}

        {loading ? (
          <Modal visible transparent statusBarTranslucent animationType="fade">
            <View style={$loaderContainer}>
              <ActivityIndicator color={colors.primary[500]} />
            </View>
            <View style={$loaderBackdrop} />
          </Modal>
        ) : null}
      </Screen>
    )
  },
)

const $container: ViewStyle = {
  flex: 1,
}

const $holeView: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: colors.black,
  opacity: 0.4,
  zIndex: 1,
}

const $holeHeader: ViewStyle = {
  height: 40,
  width: HoleSize,
  position: "absolute",
  zIndex: 2,
  left: Hole.x,
  top: Hole.y - 40,
  alignItems: "center",
  justifyContent: "center",
}

const $holeTitle: TextStyle = {
  color: colors.white,
}

const $loaderContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}

const $loaderBackdrop: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
}
