import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const overlaySize = 250; // Tamaño del cuadro de escaneo

export default function Overlay() {
  return (
    <View style={styles.overlay}>
      {/* Capas oscuras en la parte superior e inferior */}
      <View
        style={[
          styles.darkLayer,
          { top: 0, height: (height - overlaySize) / 2, width: "100%" },
        ]}
      />
      <View
        style={[
          styles.darkLayer,
          {
            bottom: -50,
            height: (height - overlaySize) / 2 + 50,
            width: "100%",
          }, // 🔥 Se alarga hasta los botones del sistema
        ]}
      />

      {/* Capas oscuras a los lados izquierdo y derecho */}
      <View
        style={[
          styles.darkLayer,
          {
            left: 0,
            width: (width - overlaySize) / 2,
            height: overlaySize,
            top: "50%",
            transform: [{ translateY: -overlaySize / 2 }],
          },
        ]}
      />
      <View
        style={[
          styles.darkLayer,
          {
            right: 0,
            width: (width - overlaySize) / 2,
            height: overlaySize,
            top: "50%",
            transform: [{ translateY: -overlaySize / 2 }],
          },
        ]}
      />

      {/* Cuadro central para escanear */}
      <View style={styles.frame} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  darkLayer: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Oscurecimiento fuera del área de escaneo
  },
  frame: {
    width: overlaySize,
    height: overlaySize,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: "transparent",
    borderRadius: 10,
    position: "absolute",
    top: "50%", // ✅ Centrado verticalmente
    left: "50%", // ✅ Centrado horizontalmente
    transform: [
      { translateX: -overlaySize / 2 },
      { translateY: -overlaySize / 2 },
    ], // ✅ Corrección para centrarlo exactamente
  },
});
