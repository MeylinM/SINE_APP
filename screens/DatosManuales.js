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
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getCurrentDateTime } from "../utils/DateHelper";
import { styles } from "../styles/FormStyles";
import { DataContext } from "./DataContext"; // ✅ Importar el contexto
import { Picker } from "@react-native-picker/picker";

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
  const [showAlmacenPicker, setShowAlmacenPicker] = useState(false);
  const [showOtObraPicker, setShowOtObraPicker] = useState(false);
  const [showEmpleadoRecibidoPicker, setShowEmpleadoRecibidoPicker] =
    useState(false);
  const [showEmpleadoParaDevolverPicker, setShowEmpleadoParaDevolverPicker] =
    useState(false);
  const [showEmpleadoDevueltoPicker, setShowEmpleadoDevueltoPicker] =
    useState(false);
  const backHandler = useRef(null);

  const validarMatricula = () => {
    if (!matricula.trim()) {
      Alert.alert("Error", "Introduce una matrícula válida.");
      return;
    }

    const registroExistente = datosGuardados.find(
      (dato) => dato.matricula === matricula
    );

    let nuevoEstado = "RECIBIDO"; // Estado por defecto si la matrícula no existe
    let nuevaFechaParaDevolver = "";
    let nuevaFechaDevuelto = "";

    if (registroExistente) {
      Alert.alert(
        "Matrícula Encontrada",
        "Se han cargado los datos de la matrícula existente."
      );

      switch (registroExistente.estado) {
        case "RECIBIDO":
          nuevoEstado = "PARA DEVOLVER";
          nuevaFechaParaDevolver = getCurrentDateTime(); // ✅ Asigna la fecha inmediatamente
          break;
        case "PARA DEVOLVER":
          nuevoEstado = "DEVUELTO";
          nuevaFechaDevuelto = getCurrentDateTime(); // ✅ Asigna la fecha inmediatamente
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
      setFechaParaDevolver(
        nuevaFechaParaDevolver || registroExistente.fechaParaDevolver || ""
      );
      setEmpleadoDevuelto(registroExistente.empleadoDevuelto || "");
      setFechaDevuelto(
        nuevaFechaDevuelto || registroExistente.fechaDevuelto || ""
      );
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

  const [datosGuardadosTemporalmente, setDatosGuardadosTemporalmente] =
    useState(null);

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
    setFechaParaDevolver(
      estado === "RECIBIDO" ? getCurrentDateTime() : fechaParaDevolver
    );
    setFechaDevuelto(
      estado === "PARA DEVOLVER" ? getCurrentDateTime() : fechaDevuelto
    );

    // Guardar el nuevo registro temporalmente y esperar a que se actualice el estado
    setDatosGuardadosTemporalmente(nuevoRegistro);
  };

  // useEffect detectará el cambio en datosGuardadosTemporalmente y navegará cuando se haya actualizado
  useEffect(() => {
    if (datosGuardadosTemporalmente) {
      navigation.navigate("Home");
      setDatosGuardadosTemporalmente(null); // Resetear para evitar múltiples navegaciones
    }
  }, [datosGuardadosTemporalmente]);

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
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%" }}
            value={almacen}
            onChangeText={setAlmacen}
            placeholder="Introduce o selecciona Almacén"
            editable={validado && estado === "RECIBIDO"}
          />

          {Platform.OS === "ios" ? (
            <>
              <TouchableOpacity
                onPress={() => setShowAlmacenPicker(true)}
                style={{ width: 30, alignItems: "center" }}
              >
                <Text>▼</Text>
              </TouchableOpacity>

              <Modal
                visible={showAlmacenPicker}
                transparent
                animationType="slide"
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Picker
                      selectedValue={almacen}
                      onValueChange={(itemValue) => {
                        setAlmacen(itemValue);
                        setShowAlmacenPicker(false);
                      }}
                    >
                      <Picker.Item
                        label="Selecciona un Almacén"
                        value="custom"
                      />
                      <Picker.Item label="Almacén 1" value="Almacen1" />
                      <Picker.Item label="Almacén 2" value="Almacen2" />
                    </Picker>
                    <Button
                      title="Cerrar"
                      onPress={() => setShowAlmacenPicker(false)}
                    />
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <Picker
              selectedValue={validado ? almacen || "custom" : "disabled"}
              onValueChange={(itemValue) => {
                if (itemValue !== "custom" && itemValue !== "disabled") {
                  setAlmacen(itemValue);
                }
              }}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "RECIBIDO"}
              mode="dropdown" // 🔹 Solo en Android funciona
            >
              <Picker.Item label="Selecciona un Almacén" value="custom" />
              <Picker.Item label="Almacén 1" value="Almacen1" />
              <Picker.Item label="Almacén 2" value="Almacen2" />
            </Picker>
          )}
        </View>

        <Text style={styles.label}>OT Obra:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%" }}
            value={otObra}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, ""); // Solo permite números
              setOtObra(numericText);
            }}
            placeholder="Introduce o selecciona OT Obra"
            keyboardType="numeric"
            editable={validado && estado === "RECIBIDO"}
          />

          {Platform.OS === "ios" ? (
            <>
              <TouchableOpacity
                onPress={() => setShowOtObraPicker(true)}
                style={{ width: 30, alignItems: "center" }}
              >
                <Text>▼</Text>
              </TouchableOpacity>

              <Modal
                visible={showOtObraPicker}
                transparent
                animationType="slide"
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Picker
                      selectedValue={otObra}
                      onValueChange={(itemValue) => {
                        setOtObra(itemValue);
                        setShowOtObraPicker(false);
                      }}
                    >
                      <Picker.Item
                        label="Selecciona un OT de obra"
                        value="custom"
                      />
                      <Picker.Item label="1001" value="1001" />
                      <Picker.Item label="1002" value="1002" />
                      <Picker.Item label="1003" value="1003" />
                    </Picker>
                    <Button
                      title="Cerrar"
                      onPress={() => setShowOtObraPicker(false)}
                    />
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <Picker
              selectedValue={validado ? otObra || "custom" : "disabled"}
              onValueChange={(itemValue) => {
                if (itemValue !== "custom" && itemValue !== "disabled") {
                  setOtObra(itemValue);
                }
              }}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "RECIBIDO"}
              mode="dropdown" // 🔹 Solo en Android funciona
            >
              <Picker.Item label="Selecciona un OT de obra" value="custom" />
              <Picker.Item label="1001" value="1001" />
              <Picker.Item label="1002" value="1002" />
              <Picker.Item label="1003" value="1003" />
            </Picker>
          )}
        </View>

        <Text style={styles.label}>Descripción Obra:</Text>
        <TextInput
          style={styles.input}
          value={descripcionObra}
          onChangeText={setDescripcionObra}
          editable={validado && estado === "RECIBIDO"}
        />

        <Text style={styles.label}>Información Recibido:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%" }}
            value={empleadoRecibido}
            onChangeText={setEmpleadoRecibido}
            placeholder="Introduce o selecciona Empleado Recibido"
            editable={validado && estado === "RECIBIDO"}
          />
          {Platform.OS === "ios" ? (
            <>
              <TouchableOpacity
                onPress={() => setShowEmpleadoRecibidoPicker(true)}
                style={{ width: 30, alignItems: "center" }}
              >
                <Text>▼</Text>
              </TouchableOpacity>
              <Modal
                visible={showEmpleadoRecibidoPicker}
                transparent
                animationType="slide"
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Picker
                      selectedValue={empleadoRecibido}
                      onValueChange={(itemValue) => {
                        setEmpleadoRecibido(itemValue);
                        setShowEmpleadoRecibidoPicker(false);
                      }}
                    >
                      <Picker.Item label="Selecciona un Empleado" value="" />
                      <Picker.Item label="Juan Pérez" value="JuanPerez" />
                      <Picker.Item label="María García" value="MariaGarcia" />
                      <Picker.Item
                        label="Carlos Rodríguez"
                        value="CarlosRodriguez"
                      />
                    </Picker>
                    <Button
                      title="Cerrar"
                      onPress={() => setShowEmpleadoRecibidoPicker(false)}
                    />
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <Picker
              selectedValue={empleadoRecibido}
              onValueChange={setEmpleadoRecibido}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "RECIBIDO"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              <Picker.Item label="Juan Pérez" value="JuanPerez" />
              <Picker.Item label="María García" value="MariaGarcia" />
              <Picker.Item label="Carlos Rodríguez" value="CarlosRodriguez" />
            </Picker>
          )}
        </View>
        <Text style={styles.staticText}>{fechaRecibido}</Text>

        <Text style={styles.label}>Información Para Devolver:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%" }}
            value={empleadoParaDevolver}
            onChangeText={setEmpleadoParaDevolver}
            placeholder="Introduce o selecciona Empleado Para Devolver"
            editable={validado && estado === "PARA DEVOLVER"}
          />
          {Platform.OS === "ios" ? (
            <>
              <TouchableOpacity
                onPress={() => setShowEmpleadoParaDevolverPicker(true)}
                style={{ width: 30, alignItems: "center" }}
              >
                <Text>▼</Text>
              </TouchableOpacity>
              <Modal
                visible={showEmpleadoParaDevolverPicker}
                transparent
                animationType="slide"
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Picker
                      selectedValue={empleadoParaDevolver}
                      onValueChange={(itemValue) => {
                        setEmpleadoParaDevolver(itemValue);
                        setShowEmpleadoParaDevolverPicker(false);
                      }}
                    >
                      <Picker.Item label="Selecciona un Empleado" value="" />
                      <Picker.Item label="Juan Pérez" value="JuanPerez" />
                      <Picker.Item label="María García" value="MariaGarcia" />
                      <Picker.Item
                        label="Carlos Rodríguez"
                        value="CarlosRodriguez"
                      />
                    </Picker>
                    <Button
                      title="Cerrar"
                      onPress={() => setShowEmpleadoParaDevolverPicker(false)}
                    />
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <Picker
              selectedValue={empleadoParaDevolver}
              onValueChange={setEmpleadoParaDevolver}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "PARA DEVOLVER"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              <Picker.Item label="Juan Pérez" value="JuanPerez" />
              <Picker.Item label="María García" value="MariaGarcia" />
              <Picker.Item label="Carlos Rodríguez" value="CarlosRodriguez" />
            </Picker>
          )}
        </View>
        <Text style={styles.staticText}>{fechaParaDevolver}</Text>

        <Text style={styles.label}>Información Devuelto:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%" }}
            value={empleadoDevuelto}
            onChangeText={setEmpleadoDevuelto}
            placeholder="Introduce o selecciona Empleado Devuelto"
            editable={validado && estado === "DEVUELTO"}
          />
          {Platform.OS === "ios" ? (
            <>
              <TouchableOpacity
                onPress={() => setShowEmpleadoDevueltoPicker(true)}
                style={{ width: 30, alignItems: "center" }}
              >
                <Text>▼</Text>
              </TouchableOpacity>
              <Modal
                visible={showEmpleadoDevueltoPicker}
                transparent
                animationType="slide"
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 10,
                    }}
                  >
                    <Picker
                      selectedValue={empleadoDevuelto}
                      onValueChange={(itemValue) => {
                        setEmpleadoDevuelto(itemValue);
                        setShowEmpleadoDevueltoPicker(false);
                      }}
                    >
                      <Picker.Item label="Selecciona un Empleado" value="" />
                      <Picker.Item label="Juan Pérez" value="JuanPerez" />
                      <Picker.Item label="María García" value="MariaGarcia" />
                      <Picker.Item
                        label="Carlos Rodríguez"
                        value="CarlosRodriguez"
                      />
                    </Picker>
                    <Button
                      title="Cerrar"
                      onPress={() => setShowEmpleadoDevueltoPicker(false)}
                    />
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <Picker
              selectedValue={empleadoDevuelto}
              onValueChange={setEmpleadoDevuelto}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "DEVUELTO"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              <Picker.Item label="Juan Pérez" value="JuanPerez" />
              <Picker.Item label="María García" value="MariaGarcia" />
              <Picker.Item label="Carlos Rodríguez" value="CarlosRodriguez" />
            </Picker>
          )}
        </View>
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
