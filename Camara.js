import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Camera } from "expo-camera"; // ✅ Importación corregida
import { useIsFocused } from "@react-navigation/native";

const Camara = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [key, setKey] = useState(0);

  console.log("📸 Camera Constants:", Camera?.Constants);

  const [type, setType] = useState(
    Camera?.Constants?.Type?.back || "back"
  );

  useEffect(() => {
    (async () => {
      console.log("🔵 Solicitando permisos de cámara...");
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("🔵 Estado del permiso:", status);
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Solicitando permiso de la cámara...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No se ha concedido acceso a la cámara.</Text>
        <Button
          title="Conceder permisos"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status === "granted") {
              setHasPermission(true);
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && hasPermission ? (
        <>
          <Text style={styles.debugText}>📸 Cámara Activada</Text>
          <Camera
            key={key}
            ref={cameraRef}
            style={styles.camera}
            type={type}
            onCameraReady={() => {
              console.log("✅ Cámara lista");
              setCameraReady(true);
              setCameraError(false);
            }}
            onMountError={(error) => {
              console.error("❌ Error al montar la cámara:", error);
              setCameraError(true);
              setKey((prevKey) => prevKey + 1);
            }}
          />
        </>
      ) : (
        <Text style={styles.debugText}>⚠️ La cámara no se ha montado</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  debugText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    top: 40,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
});

export default Camara;
