import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  AppState,
  Alert,
  BackHandler,
  Text,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Overlay from "../styles/Overlay";

export default function Camara({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

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
    <SafeAreaView
      style={[StyleSheet.absoluteFillObject, { backgroundColor: "black" }]}
    >
      <StatusBar hidden />
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      <Overlay />
    </SafeAreaView>
  );
}
