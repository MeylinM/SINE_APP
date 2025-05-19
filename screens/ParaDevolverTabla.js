import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";

import styles from "../styles/TableStyle";
import * as ScreenOrientation from "expo-screen-orientation";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { obtenerHistorialProductos } from "../services/ProductoServices";

export default function ParaDevolverTabla() {
  const [historialProductos, setHistorialProductos] = useState([]);
  const [matriculaBusqueda, setMatriculaBusqueda] = useState("");
  const [empleadoBusqueda, setEmpleadoBusqueda] = useState("");
  const navigation = useNavigation();
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
    const cambiarOrientacion = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    };
    cambiarOrientacion();

    const cargarDatos = async () => {
      try {
        console.log("🔹 Cargando historial de productos...");
        const historialDB = await obtenerHistorialProductos();
        setHistorialProductos(historialDB);
        console.log("✅ Datos cargados correctamente.");
      } catch (error) {
        console.error("❌ Error al obtener historial de productos:", error);
      }
    };

    cargarDatos();

    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  const filteredBobinas = historialProductos.filter((bobina) => {
    const coincideEstado =
      bobina.estado && bobina.estado.trim().toLowerCase() === "para devolver";

    const coincideMatricula = bobina.matricula.includes(matriculaBusqueda);
    const textoBusqueda = empleadoBusqueda.toLowerCase();
    const coincideEmpleado =
      textoBusqueda === "" ||
      bobina.empleado1?.toLowerCase().includes(textoBusqueda) ||
      bobina.empleado2?.toLowerCase().includes(textoBusqueda) ||
      bobina.empleado3?.toLowerCase().includes(textoBusqueda);

    return coincideEstado && coincideMatricula && coincideEmpleado;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BOBINAS PARA DEVOLVER</Text>

      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por matrícula"
          value={matriculaBusqueda}
          onChangeText={(text) => setMatriculaBusqueda(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Buscar por empleado"
          value={empleadoBusqueda}
          onChangeText={(text) => setEmpleadoBusqueda(text)}
        />
      </View>

      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>QR ID</Text>
            <Text style={styles.headerCell}>MATRÍCULA</Text>
            <Text style={styles.headerCell}>ALMACÉN</Text>
            <Text style={styles.headerCell}>OT</Text>
            <Text style={styles.headerCell}>DESCRIPCIÓN OBRA</Text>
            <Text style={styles.headerCell}>ESTADO</Text>

            <View style={styles.headerGroup}>
              <Text style={styles.headerCellBig}>INFORMACIÓN RECOGIDA</Text>
              <View style={styles.subHeaderRow}>
                <Text style={styles.subHeaderCell}>Empleado</Text>
                <Text style={styles.subHeaderCell}>Fecha y Hora</Text>
              </View>
            </View>

            <View style={styles.headerGroup}>
              <Text style={styles.headerCellBig}>INFORMACIÓN DEVOLUCIÓN</Text>
              <View style={styles.subHeaderRow}>
                <Text style={styles.subHeaderCell}>Empleado</Text>
                <Text style={styles.subHeaderCell}>Fecha y Hora</Text>
              </View>
            </View>

            <View style={styles.headerGroup}>
              <Text style={styles.headerCellBig}>INFORMACIÓN CONFIRMACIÓN</Text>
              <View style={styles.subHeaderRow}>
                <Text style={styles.subHeaderCell}>Empleado</Text>
                <Text style={styles.subHeaderCell}>Fecha y Hora</Text>
              </View>
            </View>

            <Text style={styles.headerCell}>OBSERVACIONES</Text>
          </View>

          <ScrollView style={styles.dataScroll} nestedScrollEnabled={true}>
            {filteredBobinas.map((bobina, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{bobina.producto_id || "-"}</Text>
                <Text style={styles.cell}>{bobina.matricula || "-"}</Text>
                <Text style={styles.cell}>{bobina.nombre_almacen || "-"}</Text>
                <Text style={styles.cell}>{bobina.ot || "-"}</Text>
                <Text style={styles.cell}>
                  {bobina.descripcion_obra || "-"}
                </Text>
                <Text style={styles.cell}>{bobina.estado || "-"}</Text>

                <Text style={styles.cell}>{bobina.empleado1 || "-"}</Text>
                <Text style={styles.cell}>{bobina.fecha1 || "-"}</Text>

                <Text style={styles.cell}>{bobina.empleado2 || "-"}</Text>
                <Text style={styles.cell}>{bobina.fecha2 || "-"}</Text>

                <Text style={styles.cell}>{bobina.empleado3 || "-"}</Text>
                <Text style={styles.cell}>{bobina.fecha3 || "-"}</Text>

                <Text style={styles.cell}>{bobina.observaciones || "-"}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
