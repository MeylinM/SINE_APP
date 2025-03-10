import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  BackHandler,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getCurrentDateTime } from "../utils/DateHelper";
import { styles } from "../styles/FormStyles";
import { DataContext } from "./DataContext"; // ✅ Importar el contexto

export default function DatosManuales({ navigation }) {
  const { datosGuardados, setDatosGuardados } = useContext(DataContext);

  // Estados del formulario
  const [matricula, setMatricula] = useState("");
  const [almacen, setAlmacen] = useState("");
  const [otObra, setOtObra] = useState("");
  const [descripcionObra, setDescripcionObra] = useState("");
  const [estado, setEstado] = useState(""); // Estado actualizado tras validación
  const [empleadoRecibido, setEmpleadoRecibido] = useState("");
  const [fechaRecibido, setFechaRecibido] = useState("");
  const [empleadoParaDevolver, setEmpleadoParaDevolver] = useState("");
  const [fechaParaDevolver, setFechaParaDevolver] = useState("");
  const [empleadoDevuelto, setEmpleadoDevuelto] = useState("");
  const [fechaDevuelto, setFechaDevuelto] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [validado, setValidado] = useState(false);

  const backHandler = useRef(null);

  useEffect(() => {
    backHandler.current = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.current?.remove();
  }, []);

  const validarMatricula = () => {
    if (!matricula.trim()) {
      Alert.alert("Error", "Introduce una matrícula válida.");
      return;
    }

    const registroExistente = datosGuardados.find(
      (dato) => dato.matricula === matricula
    );

    let nuevoEstado = "RECIBIDO"; // Estado por defecto si la matrícula no existe

    if (registroExistente) {
      Alert.alert(
        "Matrícula Encontrada",
        "Se han cargado los datos de la matrícula existente."
      );

      switch (registroExistente.estado) {
        case "RECIBIDO":
          nuevoEstado = "PARA DEVOLVER";
          break;
        case "PARA DEVOLVER":
          nuevoEstado = "DEVUELTO";
          break;
        case "DEVUELTO":
          nuevoEstado = "DEVUELTO"; // No cambia más
          break;
        default:
          nuevoEstado = "RECIBIDO";
      }

      setAlmacen(registroExistente.almacen || "");
      setOtObra(registroExistente.otObra || "");
      setDescripcionObra(registroExistente.descripcionObra || "");
      setEstado(nuevoEstado);
      setEmpleadoRecibido(registroExistente.empleadoRecibido || "");
      setFechaRecibido(registroExistente.fechaRecibido || "");
      setEmpleadoParaDevolver(registroExistente.empleadoParaDevolver || "");
      setFechaParaDevolver(registroExistente.fechaParaDevolver || "");
      setEmpleadoDevuelto(registroExistente.empleadoDevuelto || "");
      setFechaDevuelto(registroExistente.fechaDevuelto || "");
      setObservaciones(registroExistente.observaciones || "");
    } else {
      Alert.alert(
        "Nueva Matrícula",
        "No existe un registro con esta matrícula. Se creará uno nuevo."
      );
      setFechaRecibido(getCurrentDateTime());
      setEstado("RECIBIDO");
    }

    setValidado(true);
  };

  const handleGuardar = () => {
    if (!validado) {
      Alert.alert("Error", "Debes validar la matrícula antes de guardar.");
      return;
    }

    const nuevoRegistro = {
      matricula,
      almacen,
      otObra,
      descripcionObra,
      estado,
      empleadoRecibido,
      fechaRecibido,
      empleadoParaDevolver,
      fechaParaDevolver:
        estado === "PARA DEVOLVER" ? getCurrentDateTime() : fechaParaDevolver,
      empleadoDevuelto,
      fechaDevuelto:
        estado === "DEVUELTO" ? getCurrentDateTime() : fechaDevuelto,
      observaciones,
    };

    setDatosGuardados((prevDatos) => {
      const index = prevDatos.findIndex((dato) => dato.matricula === matricula);
      if (index !== -1) {
        const nuevosDatos = [...prevDatos];
        nuevosDatos[index] = nuevoRegistro;
        return nuevosDatos;
      } else {
        return [...prevDatos, nuevoRegistro];
      }
    });

    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <ScrollView>
        <Text style={styles.title}>Introducción Manual de Datos</Text>

        <View style={styles.matriculaContainer}>
          <TextInput
            style={styles.matriculaInput}
            placeholder="Matrícula"
            value={matricula}
            onChangeText={setMatricula}
            editable={!validado}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[
              styles.validateButton,
              validado && styles.validateButtonChecked,
            ]}
            onPress={validarMatricula}
          >
            <Text
              style={[
                styles.validateButtonText,
                validado && styles.validateButtonTextChecked,
              ]}
            >
              {validado ? "✔" : "🔍"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.staticText}>{estado}</Text>

        <Text style={styles.label}>Almacén:</Text>
        <TextInput
          style={styles.input}
          value={almacen}
          onChangeText={setAlmacen}
          editable={validado && estado === "RECIBIDO"}
        />

        <Text style={styles.label}>OT Obra:</Text>
        <TextInput
          style={styles.input}
          value={otObra}
          onChangeText={setOtObra}
          keyboardType="numeric"
          editable={validado && estado === "RECIBIDO"}
        />

        <Text style={styles.label}>Descripción Obra:</Text>
        <TextInput
          style={styles.input}
          value={descripcionObra}
          onChangeText={setDescripcionObra}
          editable={validado && estado === "RECIBIDO"}
        />

        <Text style={styles.label}>Información Recibido:</Text>
        <TextInput
          style={styles.input}
          value={empleadoRecibido}
          onChangeText={setEmpleadoRecibido}
          editable={validado && estado === "RECIBIDO"}
        />
        <Text style={styles.staticText}>{fechaRecibido}</Text>

        <Text style={styles.label}>Información Para Devolver:</Text>
        <TextInput
          style={styles.input}
          value={empleadoParaDevolver}
          onChangeText={setEmpleadoParaDevolver}
          editable={validado && estado === "PARA DEVOLVER"}
        />
        <Text style={styles.staticText}>{fechaParaDevolver}</Text>

        <Text style={styles.label}>Información Devuelto:</Text>
        <TextInput
          style={styles.input}
          value={empleadoDevuelto}
          onChangeText={setEmpleadoDevuelto}
          editable={validado && estado === "DEVUELTO"}
        />
        <Text style={styles.staticText}>{fechaDevuelto}</Text>

        <Text style={styles.label}>Observaciones:</Text>
        <TextInput
          style={styles.input}
          value={observaciones}
          onChangeText={setObservaciones}
          editable={true}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Guardar"
            onPress={handleGuardar}
            color="#007AFF"
            disabled={!validado}
          />
          <Button
            title="Cancelar"
            onPress={() => navigation.navigate("Home")}
            color="#FF3B30"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
