import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  BackHandler,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getCurrentDateTime } from "../utils/DateHelper";
import { styles } from "../styles/FormStyles";
import { DataContext } from "./DataContext"; // ✅ Importar el contexto
import { Picker } from "@react-native-picker/picker";
export default function DatosQR({ route, navigation }) {
  const { qrData } = route.params;
  const { datosGuardados, setDatosGuardados } = useContext(DataContext);

  // Estados del formulario
  const [almacen, setAlmacen] = useState("");
  const [otObra, setOtObra] = useState("");
  const [descripcionObra, setDescripcionObra] = useState("");
  const [estado, setEstado] = useState("");
  const [empleadoRecibido, setEmpleadoRecibido] = useState("");
  const [fechaRecibido, setFechaRecibido] = useState("");
  const [empleadoParaDevolver, setEmpleadoParaDevolver] = useState("");
  const [fechaParaDevolver, setFechaParaDevolver] = useState("");
  const [empleadoDevuelto, setEmpleadoDevuelto] = useState("");
  const [fechaDevuelto, setFechaDevuelto] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const backHandler = useRef(null);

  useEffect(() => {
    if (!qrData.trim()) return;

    const nuevaFecha = getCurrentDateTime();
    const registroExistente = datosGuardados.find(
      (dato) => dato.matricula === qrData
    );

    let nuevoEstado = "RECIBIDO"; // Estado por defecto si la matrícula no existe
    let nuevaFechaParaDevolver = "";
    let nuevaFechaDevuelto = "";

    if (registroExistente) {
      switch (registroExistente.estado) {
        case "RECIBIDO":
          nuevoEstado = "PARA DEVOLVER";
          nuevaFechaParaDevolver = getCurrentDateTime(); // ✅ Se asigna la fecha automáticamente
          break;
        case "PARA DEVOLVER":
          nuevoEstado = "DEVUELTO";
          nuevaFechaDevuelto = getCurrentDateTime(); // ✅ Se asigna la fecha automáticamente
          break;
        case "DEVUELTO":
          nuevoEstado = "DEVUELTO";
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
      setFechaParaDevolver(
        nuevaFechaParaDevolver || registroExistente.fechaParaDevolver || ""
      );
      setEmpleadoDevuelto(registroExistente.empleadoDevuelto || "");
      setFechaDevuelto(
        nuevaFechaDevuelto || registroExistente.fechaDevuelto || ""
      );
      setObservaciones(registroExistente.observaciones || "");
    } else {
      // Si no hay datos previos, se inicia con "RECIBIDO"
      setFechaRecibido(nuevaFecha);
      setEstado("RECIBIDO");
    }

    backHandler.current = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.current?.remove();
  }, [qrData, datosGuardados]);

  const handleGuardar = () => {
    const nuevoRegistro = {
      matricula: qrData,
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

    const index = datosGuardados.findIndex((dato) => dato.matricula === qrData);
    if (index !== -1) {
      const nuevosDatos = [...datosGuardados];
      nuevosDatos[index] = nuevoRegistro;
      setDatosGuardados(nuevosDatos);
    } else {
      setDatosGuardados([...datosGuardados, nuevoRegistro]);
    }

    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <ScrollView>
        <Text style={styles.title}>Introducción de Datos</Text>

        <Text style={styles.label}>Matrícula:</Text>
        <Text style={styles.staticText}>{qrData}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.staticText}>{estado}</Text>

        <Text style={styles.label}>Almacén:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%" }} // Mantiene el diseño original
            value={almacen}
            onChangeText={setAlmacen} // Permite escribir manualmente
            placeholder="Introduce o selecciona Almacén"
            editable={estado === "RECIBIDO"} // Bloquea si no está validado
          />
          <Picker
            selectedValue={
              estado === "RECIBIDO" ? almacen || "custom" : "disabled"
            } // Bloquea hasta validar
            onValueChange={(itemValue) => {
              if (itemValue !== "custom" && itemValue !== "disabled") {
                setAlmacen(itemValue);
              }
            }}
            style={{ width: 30, height: "100%" }} // Solo la flecha lateral
            enabled={estado === "RECIBIDO"} // Bloquea el Picker hasta validar
          >
            <Picker.Item label="Selecciona un Almacén" value="custom" />
            <Picker.Item label="Almacén 1" value="Almacen1" />
            <Picker.Item label="Almacén 2" value="Almacen2" />
          </Picker>
        </View>

        <Text style={styles.label}>OT Obra:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%" }} // Mantiene el diseño original
            value={otObra}
            onChangeText={(text) => {
              // Filtra solo números
              const numericText = text.replace(/[^0-9]/g, "");
              setOtObra(numericText);
            }}
            placeholder="Introduce o selecciona OT Obra"
            keyboardType="numeric" // Muestra teclado solo con números
            editable={estado === "RECIBIDO"} // Bloquea si no está validado
          />
          <Picker
            selectedValue={
              estado === "RECIBIDO" ? otObra || "custom" : "disabled"
            } // Bloquea hasta validar
            onValueChange={(itemValue) => {
              if (itemValue !== "custom" && itemValue !== "disabled") {
                setOtObra(itemValue);
              }
            }}
            style={{ width: 30, height: "100%" }} // Solo la flecha lateral
            enabled={estado === "RECIBIDO"} // Bloquea el Picker hasta validar
          >
            <Picker.Item label="Selecciona un OT de obra" value="custom" />
            <Picker.Item label="1001" value="1001" />
            <Picker.Item label="1002" value="1002" />
            <Picker.Item label="1003" value="1003" />
          </Picker>
        </View>

        <Text style={styles.label}>Descripción Obra:</Text>
        <TextInput
          style={styles.input}
          value={descripcionObra}
          onChangeText={setDescripcionObra}
          editable={estado === "RECIBIDO"}
        />

        <Text style={styles.label}>Información Recibido:</Text>
        <TextInput
          style={styles.input}
          value={empleadoRecibido}
          onChangeText={setEmpleadoRecibido}
          editable={estado === "RECIBIDO"}
        />
        <Text style={styles.staticText}>{fechaRecibido}</Text>

        <Text style={styles.label}>Información Para Devolver:</Text>
        <TextInput
          style={styles.input}
          value={empleadoParaDevolver}
          onChangeText={setEmpleadoParaDevolver}
          editable={estado === "PARA DEVOLVER"}
        />
        <Text style={styles.staticText}>{fechaParaDevolver}</Text>

        <Text style={styles.label}>Información Devuelto:</Text>
        <TextInput
          style={styles.input}
          value={empleadoDevuelto}
          onChangeText={setEmpleadoDevuelto}
          editable={estado === "DEVUELTO"}
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
          <Button title="Guardar" onPress={handleGuardar} color="#007AFF" />
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
