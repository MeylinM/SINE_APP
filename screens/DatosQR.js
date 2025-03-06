import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  BackHandler,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getCurrentDateTime } from "../utils/DateHelper";
import { styles } from "../styles/FormStyles";

export default function DatosQR({ route, navigation }) {
  const { qrData } = route.params; // Datos escaneados desde Camara.js

  // Simulación de base de datos temporal
  const [datosGuardados, setDatosGuardados] = useState([]);

  // Estados del formulario
  const [almacen, setAlmacen] = useState("");
  const [otObra, setOtObra] = useState("");
  const [descripcionObra, setDescripcionObra] = useState("");
  const [estado, setEstado] = useState("RECIBIDO");
  const [empleadoRecibido, setEmpleadoRecibido] = useState("");
  const [fechaRecibido, setFechaRecibido] = useState("");
  const [empleadoParaDevolver, setEmpleadoParaDevolver] = useState("");
  const [fechaParaDevolver, setFechaParaDevolver] = useState("");
  const [empleadoDevuelto, setEmpleadoDevuelto] = useState("");
  const [fechaDevuelto, setFechaDevuelto] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [contador, setContador] = useState(0);

  const backHandler = useRef(null);

  useEffect(() => {
    const nuevaFecha = getCurrentDateTime();

    // Buscar si la matrícula ya existe en los datos guardados
    const registroExistente = datosGuardados.find(
      (dato) => dato.matricula === qrData
    );

    if (registroExistente) {
      setAlmacen(registroExistente.almacen);
      setOtObra(registroExistente.otObra);
      setDescripcionObra(registroExistente.descripcionObra);
      setEstado(registroExistente.estado);
      setEmpleadoRecibido(registroExistente.empleadoRecibido);
      setFechaRecibido(registroExistente.fechaRecibido);
      setEmpleadoParaDevolver(registroExistente.empleadoParaDevolver);
      setFechaParaDevolver(registroExistente.fechaParaDevolver);
      setEmpleadoDevuelto(registroExistente.empleadoDevuelto);
      setFechaDevuelto(registroExistente.fechaDevuelto);
      setObservaciones(registroExistente.observaciones);
      setContador(registroExistente.contador);
    } else {
      setFechaRecibido(nuevaFecha); // Solo si es la primera vez
    }

    backHandler.current = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.current?.remove();
  }, []);

  const confirmarAccion = (mensaje, accion) => {
    Alert.alert("Confirmación", mensaje, [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", onPress: accion },
    ]);
  };

  const handleGuardar = () => {
    confirmarAccion("¿Estás seguro de guardar los cambios?", () => {
      const nuevoContador = contador + 1;
      let nuevoEstado = estado;
      let nuevaFechaParaDevolver = fechaParaDevolver;
      let nuevaFechaDevuelto = fechaDevuelto;

      if (nuevoContador === 1) {
        nuevoEstado = "PARA DEVOLVER";
        nuevaFechaParaDevolver = getCurrentDateTime();
      }
      if (nuevoContador === 2) {
        nuevoEstado = "DEVUELTO";
        nuevaFechaDevuelto = getCurrentDateTime();
      }

      setContador(nuevoContador);
      setEstado(nuevoEstado);
      setFechaParaDevolver(nuevaFechaParaDevolver);
      setFechaDevuelto(nuevaFechaDevuelto);

      const nuevoRegistro = {
        matricula: qrData,
        almacen,
        otObra,
        descripcionObra,
        estado: nuevoEstado,
        empleadoRecibido,
        fechaRecibido,
        empleadoParaDevolver,
        fechaParaDevolver: nuevaFechaParaDevolver,
        empleadoDevuelto,
        fechaDevuelto: nuevaFechaDevuelto,
        observaciones,
        contador: nuevoContador,
      };

      // Si ya existe, actualizarlo en el array
      const index = datosGuardados.findIndex(
        (dato) => dato.matricula === qrData
      );
      if (index !== -1) {
        const nuevosDatos = [...datosGuardados];
        nuevosDatos[index] = nuevoRegistro;
        setDatosGuardados(nuevosDatos);
      } else {
        setDatosGuardados([...datosGuardados, nuevoRegistro]);
      }

      navigation.navigate("Home"); // ✅ Ahora vuelve a Home correctamente
    });
  };

  const handleCancelar = () => {
    confirmarAccion("¿Estás seguro de cancelar y volver al inicio?", () => {
      navigation.navigate("Home"); // ✅ Ahora vuelve a Home correctamente
    });
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
        <TextInput
          style={styles.input}
          value={almacen}
          onChangeText={setAlmacen}
          placeholder="Introduce el almacén"
          editable={contador < 3}
        />

        <Text style={styles.label}>OT Obra:</Text>
        <TextInput
          style={styles.input}
          value={otObra}
          onChangeText={setOtObra}
          placeholder="Introduce OT Obra"
          keyboardType="numeric"
          editable={contador < 3}
        />

        <Text style={styles.label}>Descripción Obra:</Text>
        <TextInput
          style={styles.input}
          value={descripcionObra}
          onChangeText={setDescripcionObra}
          placeholder="Descripción de la obra"
          editable={contador < 3}
        />

        <Text style={styles.label}>Información Recibido:</Text>
        <TextInput
          style={styles.input}
          value={empleadoRecibido}
          onChangeText={setEmpleadoRecibido}
          placeholder="Nombre del empleado"
          editable={contador === 0}
        />
        <Text style={styles.staticText}>{fechaRecibido}</Text>

        <Text style={styles.label}>Información Para Devolver:</Text>
        <TextInput
          style={styles.input}
          value={empleadoParaDevolver}
          onChangeText={setEmpleadoParaDevolver}
          placeholder="Nombre del empleado"
          editable={contador === 1}
        />
        <Text style={styles.staticText}>
          {fechaParaDevolver || "No asignada"}
        </Text>

        <Text style={styles.label}>Información Devuelto:</Text>
        <TextInput
          style={styles.input}
          value={empleadoDevuelto}
          onChangeText={setEmpleadoDevuelto}
          placeholder="Nombre del empleado"
          editable={contador === 2}
        />
        <Text style={styles.staticText}>{fechaDevuelto || "No asignada"}</Text>

        <Text style={styles.label}>Observaciones:</Text>
        <TextInput
          style={styles.input}
          value={observaciones}
          onChangeText={setObservaciones}
          placeholder="Observaciones"
          editable={true} // Siempre editable
        />

        <View style={styles.buttonContainer}>
          <Button title="Guardar" onPress={handleGuardar} color="#007AFF" />
          <Button title="Cancelar" onPress={handleCancelar} color="#FF3B30" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
