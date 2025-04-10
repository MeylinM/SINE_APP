import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, AppState, Alert, BackHandler } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Overlay from "../styles/Overlay";
import { useFocusEffect } from "@react-navigation/native";
export default function Camara({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => subscription.remove();
    }, [])
  );
  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      setScanned(false);
      qrLock.current = false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleBarcodeScanned = ({ data }) => {
    if (qrLock.current || scanned) return; // Evita lecturas múltiples

    qrLock.current = true;
    setScanned(true);

    // Alerta con dos botones
    Alert.alert("QR Leído", "¿Es correcto el código escaneado?", [
      {
        text: "No",
        onPress: () => {
          setScanned(false);
          qrLock.current = false;
        },
        style: "cancel",
      },
      {
        text: "Sí",
        onPress: () => {
          console.log("✅ Navegando a DatosQR con datos:", data);
          setTimeout(() => {
            navigation.navigate("DatosQR", { qrData: data }); // ✅ Pasar los datos escaneados a DatosQR
            qrLock.current = false; // 🔓 Desbloquear después de la navegación
          }, 500);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar hidden />
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      <Overlay />
    </SafeAreaView>
  );
}
