import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import styles from "../styles/TableStyle";
import * as ScreenOrientation from "expo-screen-orientation";
import ModalSelector from "react-native-modal-selector";
import { Ionicons } from "@expo/vector-icons";
import { obtenerHistorialProductos } from "../services/HistorialServices";

export default function AllDataTable() {
  const [historialProductos, setHistorialProductos] = useState([]);

  const [estadoSeleccionado, setEstadoSeleccionado] = useState("All");
  const [matriculaBusqueda, setMatriculaBusqueda] = useState("");
  const [empleadoBusqueda, setEmpleadoBusqueda] = useState("");

  const estados = [
    { key: "All", label: "Todos" },
    { key: "Recibido", label: "Recibido" },
    { key: "Para devolver", label: "Para Devolver" },
    { key: "Devuelto", label: "Devuelto" },
  ];

  useEffect(() => {
    const cambiarOrientacion = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    };
    cambiarOrientacion();

    // Cargar datos de la base de datos
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
      estadoSeleccionado === "All" ||
      (bobina.estado &&
        bobina.estado.trim().toLowerCase() ===
          estadoSeleccionado.toLowerCase());
    const coincideMatricula = bobina.matricula.includes(matriculaBusqueda);
    const textoBusqueda = empleadoBusqueda.toLowerCase();
    const coincideEmpleado =
      textoBusqueda === "" ||
      (bobina.empleadoRecibido &&
        bobina.empleadoRecibido.toLowerCase().includes(textoBusqueda)) ||
      (bobina.empleadoParaDevolver &&
        bobina.empleadoParaDevolver.toLowerCase().includes(textoBusqueda)) ||
      (bobina.empleadoDevuelto &&
        bobina.empleadoDevuelto.toLowerCase().includes(textoBusqueda));

    return coincideEstado && coincideMatricula && coincideEmpleado;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTRO DE BOBINAS</Text>
      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por matrícula"
          value={matriculaBusqueda}
          onChangeText={(text) => setMatriculaBusqueda(text)}
        />
        <View style={styles.pickerContainer}>
          <ModalSelector
            data={estados}
            initValue="Seleccionar Estado"
            onChange={(option) => setEstadoSeleccionado(option.key)}
            selectTextStyle={styles.pickerText}
          >
            <TouchableOpacity style={styles.pickerTouchable}>
              <Text style={styles.pickerText}>
                {estados.find((e) => e.key === estadoSeleccionado)?.label ||
                  "Seleccionar Estado"}
              </Text>
              <Ionicons name="chevron-down-outline" size={18} color="#333" />
            </TouchableOpacity>
          </ModalSelector>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Buscar por empleado"
          value={empleadoBusqueda}
          onChangeText={(text) => setEmpleadoBusqueda(text)}
        />
      </View>

      <ScrollView horizontal>
        <View style={styles.table}>
          {/* Encabezado principal */}
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>MATRÍCULA</Text>
            <Text style={styles.headerCell}>ESTADO</Text>
            <Text style={styles.headerCell}>ALMACÉN</Text>
            <Text style={styles.headerCell}>OT OBRA</Text>
            <Text style={styles.headerCell}>DESCRIPCIÓN OBRA</Text>

            {/* Grupo de columnas para Información Recibido */}
            <View style={styles.headerGroup}>
              <Text style={styles.headerCellBig}>INFORMACIÓN RECIBIDO</Text>
              <View style={styles.subHeaderRow}>
                <Text style={styles.subHeaderCell}>Empleado</Text>
                <Text style={styles.subHeaderCell}>Fecha</Text>
              </View>
            </View>

            {/* Grupo de columnas para Información Para Devolver */}
            <View style={styles.headerGroup}>
              <Text style={styles.headerCellBig}>
                INFORMACIÓN PARA DEVOLVER
              </Text>
              <View style={styles.subHeaderRow}>
                <Text style={styles.subHeaderCell}>Empleado</Text>
                <Text style={styles.subHeaderCell}>Fecha</Text>
              </View>
            </View>

            {/* Grupo de columnas para Información Devuelto */}
            <View style={styles.headerGroup}>
              <Text style={styles.headerCellBig}>INFORMACIÓN DEVUELTO</Text>
              <View style={styles.subHeaderRow}>
                <Text style={styles.subHeaderCell}>Empleado</Text>
                <Text style={styles.subHeaderCell}>Fecha</Text>
              </View>
            </View>

            <Text style={styles.headerCell}>OBSERVACIONES</Text>
          </View>

          {/* Renderizar las filas con datos */}
          <ScrollView style={styles.dataScroll} nestedScrollEnabled={true}>
            {filteredBobinas.map((bobina, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{bobina.nombre_almacen || "-"}</Text>
                <Text style={styles.cell}>{bobina.ot || "-"}</Text>
                <Text style={styles.cell}>
                  {bobina.descripcion_obra || "-"}
                </Text>
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
