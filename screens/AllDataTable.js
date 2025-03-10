import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import globalStyles from "../styles/globalStyles";
import styles from "../styles/bobinasStyles";
import * as ScreenOrientation from "expo-screen-orientation";
import ModalSelector from "react-native-modal-selector";
import { Ionicons } from "@expo/vector-icons";
import { DataContext } from "./DataContext"; // Importar el contexto

export default function AllDataTable() {
  const { datosGuardados } = useContext(DataContext);
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

    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  const filteredBobinas = datosGuardados.filter((bobina) => {
    const coincideEstado =
      estadoSeleccionado === "All" || bobina.estado === estadoSeleccionado;
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
            <Text style={styles.headerCell}>ALMACÉN</Text>
            <Text style={styles.headerCell}>OT OBRA</Text>
            <Text style={styles.headerCell}>DESCRIPCIÓN OBRA</Text>
            <Text style={styles.headerCell}>INFORMACIÓN RECIBIDO</Text>
            <Text style={styles.headerCell}>INFORMACIÓN PARA DEVOLVER</Text>
            <Text style={styles.headerCell}>INFORMACIÓN DEVUELTO</Text>
            <Text style={styles.headerCell}>OBSERVACIONES</Text>
            <Text style={styles.headerCell}>ESTADO</Text>
          </View>

          {/* Renderizar las filas con datos */}
          <ScrollView style={styles.dataScroll} nestedScrollEnabled={true}>
            {filteredBobinas.map((bobina, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{bobina.matricula || "-"}</Text>
                <Text style={styles.cell}>{bobina.almacen || "-"}</Text>
                <Text style={styles.cell}>{bobina.otObra || "-"}</Text>
                <Text style={styles.cell}>{bobina.descripcionObra || "-"}</Text>
                <Text style={styles.cell}>
                  {bobina.empleadoRecibido || "-"}
                </Text>
                <Text style={styles.cell}>{bobina.fechaRecibido || "-"}</Text>
                <Text style={styles.cell}>
                  {bobina.empleadoParaDevolver || "-"}
                </Text>
                <Text style={styles.cell}>
                  {bobina.fechaParaDevolver || "-"}
                </Text>
                <Text style={styles.cell}>
                  {bobina.empleadoDevuelto || "-"}
                </Text>
                <Text style={styles.cell}>{bobina.fechaDevuelto || "-"}</Text>
                <Text style={styles.cell}>{bobina.observaciones || "-"}</Text>
                <Text style={styles.cell}>{bobina.estado || "-"}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
