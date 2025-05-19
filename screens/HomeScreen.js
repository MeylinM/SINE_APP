import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../styles/globalStyles";
import styles from "../styles/WorkerMenuStyles"; // ✅ Mismo estilo
import * as ScreenOrientation from "expo-screen-orientation";

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  return (
    <View style={globalStyles.container}>
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => navigation.navigate("ManualU")} // Asegúrate de tener esa pantalla registrada
      >
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>
      <Image
        source={require("../assets/header_menu.png")}
        style={styles.headerImage}
      />
      <Text style={styles.title}>Bienvenido/a</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Camara")}
      >
        <Text style={globalStyles.buttonText}>ESCANEAR QR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DatosManuales")} // ✅ Ahora lleva a la pantalla correcta
      >
        <Text style={globalStyles.buttonText}>INTRODUCIR MANUALMENTE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AllDataTable")} // ✅ El tercer botón lleva a la pantalla AllDataTable
      >
        <Text style={globalStyles.buttonText}>MOSTRAR TODOS LOS DATOS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ParaDevolverTabla")}
      >
        <Text style={globalStyles.buttonText}>MOSTRAR BOBINAS A DEVOLVER</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>SINE INGENIERIA ELECTRICA</Text>
    </View>
  );
}
