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
  const { datosGuardados, setDatosGuardados } = useContext(DataContext); // 🔥 Usa el estado global

  // Estados del formulario
  const [matricula, setMatricula] = useState("");
  const [almacen, setAlmacen] = useState("");
  const [otObra, setOtObra] = useState("");
  const [descripcionObra, setDescripcionObra] = useState("");
  const [estado, setEstado] = useState(""); // Estado se actualizará tras validar
  const [empleadoRecibido, setEmpleadoRecibido] = useState("");
  const [fechaRecibido, setFechaRecibido] = useState("");
  const [empleadoParaDevolver, setEmpleadoParaDevolver] = useState("");
  const [fechaParaDevolver, setFechaParaDevolver] = useState("");
  const [empleadoDevuelto, setEmpleadoDevuelto] = useState("");
  const [fechaDevuelto, setFechaDevuelto] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [validado, setValidado] = useState(false); // ✅ Controla si la matrícula ha sido validada

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

    if (registroExistente) {
      Alert.alert(
        "Matrícula Encontrada",
        "Se han cargado los datos de la matrícula existente."
      );

      // Cargar los datos en los campos
      setAlmacen(registroExistente.almacen || "");
      setOtObra(registroExistente.otObra || "");
      setDescripcionObra(registroExistente.descripcionObra || "");
      setEstado(registroExistente.estado || "RECIBIDO"); // Mantener el estado actual
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
      setEstado("RECIBIDO"); // Inicializar estado como "RECIBIDO"
    }

    setValidado(true);
  };

  const handleGuardar = () => {
    if (!validado) {
      Alert.alert("Error", "Debes validar la matrícula antes de guardar.");
      return;
    }

    let nuevoEstado = estado;
    let nuevaFechaParaDevolver = fechaParaDevolver;
    let nuevaFechaDevuelto = fechaDevuelto;

    // Lógica para cambiar el estado según el estado actual
    // Solo cambia el estado cuando el usuario hace clic en "Guardar"
    if (estado === "RECIBIDO") {
      nuevoEstado = "PARA DEVOLVER"; // Cambiar a "PARA DEVOLVER"
      nuevaFechaParaDevolver = getCurrentDateTime();
    } else if (estado === "PARA DEVOLVER") {
      nuevoEstado = "DEVUELTO"; // Cambiar a "DEVUELTO"
      nuevaFechaDevuelto = getCurrentDateTime();
    }

    // Crear nuevo registro con los datos actualizados
    const nuevoRegistro = {
      matricula,
      almacen,
      otObra,
      descripcionObra,
      estado: nuevoEstado, // Almacenar el nuevo estado
      empleadoRecibido,
      fechaRecibido,
      empleadoParaDevolver,
      fechaParaDevolver: nuevaFechaParaDevolver,
      empleadoDevuelto,
      fechaDevuelto: nuevaFechaDevuelto,
      observaciones,
    };

    // Guardar el registro en DataContext
    setDatosGuardados((prevDatos) => {
      const index = prevDatos.findIndex((dato) => dato.matricula === matricula);
      if (index !== -1) {
        // Si ya existe, actualizarlo
        const nuevosDatos = [...prevDatos];
        nuevosDatos[index] = nuevoRegistro;
        return nuevosDatos;
      } else {
        // Si no existe, agregarlo
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

        {/* Campo de matrícula con botón de validación */}
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
