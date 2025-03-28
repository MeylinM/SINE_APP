// DatosQR.js (actualizado como clon de DatosManuales con soporte para QR y búsqueda por ID)

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getCurrentDateTime } from "../utils/DateHelper";
import { styles } from "../styles/FormStyles";
import { DataContext } from "./DataContext";
import { Picker } from "@react-native-picker/picker";
import {
  obtenerAlmacenes,
  obtenerTodosLosAlmacenes,
  agregarAlmacen,
} from "../services/AlmacenesServices";
import { obtenerOtObras, agregarObra } from "../services/ObraServices";
import { obtenerEmpleados } from "../services/EmpleadoServices";
import {
  obtenerProductoPorId,
  actualizarProducto,
  agregarProducto,
} from "../services/ProductoServices";
import { registrarUsuarioProducto } from "../services/UsuarioRegistroServices";

export default function DatosQR({ route, navigation }) {
  const { qrData } = route.params; // <- ID del producto
  const { datosGuardados, setDatosGuardados } = useContext(DataContext);

  // Estado igual a DatosManuales
  const [id, setId] = useState("");
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
  const [validado, setValidado] = useState(false);
  const [matricula, setMatricula] = useState("");
  const [showAlmacenPicker, setShowAlmacenPicker] = useState(false);
  const [showOtObraPicker, setShowOtObraPicker] = useState(false);
  const [showEmpleadoRecibidoPicker, setShowEmpleadoRecibidoPicker] =
    useState(false);
  const [showEmpleadoParaDevolverPicker, setShowEmpleadoParaDevolverPicker] =
    useState(false);
  const [showEmpleadoDevueltoPicker, setShowEmpleadoDevueltoPicker] =
    useState(false);

  const [almacenes, setAlmacenes] = useState([]);
  const [otObras, setOtObras] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    if (qrData) {
      validarQR();
    }
  }, [qrData]);

  const validarQR = async () => {
    try {
      const almacenesDB = await obtenerAlmacenes();
      const otObrasDB = await obtenerOtObras();
      const empleadosDB = await obtenerEmpleados();
      setAlmacenes(almacenesDB);
      setOtObras(otObrasDB);
      setEmpleados(empleadosDB);

      const resultado = await obtenerProductoPorId(qrData);
      const producto = Array.isArray(resultado) ? resultado[0] : resultado;

      let estadoActual = (producto?.estado || "").toUpperCase();
      let nuevoEstado = "Recibido";

      if (producto) {
        switch (estadoActual) {
          case "RECIBIDO":
            nuevoEstado = "Para Devolver";
            break;
          case "PARA DEVOLVER":
            nuevoEstado = "Devuelto";
            break;
          case "DEVUELTO":
            nuevoEstado = "Devuelto";
            break;
          default:
            nuevoEstado = "Recibido";
        }

        setId(producto.producto_id?.toString() || qrData);
        setMatricula(producto.matricula || "");
        setAlmacen(producto.nombre_almacen || "");
        setOtObra(producto.ot || "");
        setDescripcionObra(producto.descripcion_obra || "");
        setEstado(nuevoEstado);
        setObservaciones(producto.observaciones || "");
        setEmpleadoRecibido(producto.empleado1 || "");
        setFechaRecibido(producto.fecha1 || "");
        setEmpleadoParaDevolver(producto.empleado2 || "");
        setFechaParaDevolver(producto.fecha2 || "");
        setEmpleadoDevuelto(producto.empleado3 || "");
        setFechaDevuelto(producto.fecha3 || "");
      } else {
        setId(qrData);
        setEstado("Recibido");
        setFechaRecibido(getCurrentDateTime());
      }

      setValidado(true);
    } catch (error) {
      console.error("❌ Error al validar producto desde QR:", error);
      Alert.alert(
        "Error",
        "No se pudo cargar el producto desde la base de datos."
      );
    }
  };

  // **useEffect para depuración**
  useEffect(() => {
    console.log("📌 Almacenes en estado:", almacenes);
    console.log("📌 OT Obras en estado:", otObras);
    console.log("📌 Empleados en estado:", empleados);
  }, [almacenes, otObras, empleados]);

  const [datosGuardadosTemporalmente, setDatosGuardadosTemporalmente] =
    useState(null);

  function formatFechaParaMySQL(fechaISO) {
    const fecha = new Date(fechaISO);

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    const segundos = String(fecha.getSeconds()).padStart(2, "0");

    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  }
  const handleGuardar = async () => {
    if (!validado) {
      Alert.alert("Error", "Debes validar la matrícula antes de guardar.");
      return;
    }

    const fecha = formatFechaParaMySQL(new Date());

    try {
      console.log("🔹 Iniciando proceso de guardado...");

      if (!matricula?.trim() || !estado?.trim()) {
        Alert.alert("Error", "Faltan datos para registrar el estado.");
        return;
      }

      const estadoCapitalizado =
        estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();

      let empleadoNombreSeleccionado = "";

      if (estado === "Recibido") {
        empleadoNombreSeleccionado = empleadoRecibido;
      } else if (estado === "Para Devolver") {
        empleadoNombreSeleccionado = empleadoParaDevolver;
      } else if (estado === "Devuelto") {
        empleadoNombreSeleccionado = empleadoDevuelto;
      }

      if (!empleadoNombreSeleccionado?.trim()) {
        Alert.alert("Error", "Debes seleccionar un empleado que recibe.");
        return;
      }
      const empleadoSeleccionado = empleados.find(
        (empleado) => empleado.nombre === empleadoNombreSeleccionado
      );

      if (!empleadoSeleccionado) {
        Alert.alert("Error", "Empleado no encontrado.");
        return;
      }

      const id_user = empleadoSeleccionado.id;

      // Verificamos almacén
      let idAlmacenFinal = almacen;
      const todosLosAlmacenes = await obtenerTodosLosAlmacenes();
      const almacenExistente = todosLosAlmacenes.find(
        (a) => a.nombre === almacen
      );

      if (almacenExistente) {
        if (almacenExistente.activo === 1) {
          // Ya existe y está activo ✅
          idAlmacenFinal = almacenExistente.id;
        } else {
          // Existe pero está inactivo ⚠️
          Alert.alert(
            "Almacén inactivo",
            `El almacén "${almacen}" ya existe pero está inactivo.`,
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Activar",
                onPress: async () => {
                  const actualizado = await activarAlmacen(almacenExistente.id); // crea esta función si quieres
                  if (actualizado) {
                    idAlmacenFinal = almacenExistente.id;
                    Alert.alert("Activado", "El almacén ha sido activado.");
                  } else {
                    Alert.alert("Error", "No se pudo activar el almacén.");
                  }
                },
              },
            ]
          );
          return; // Detener aquí para esperar acción del usuario
        }
      } else {
        // No existe → se crea
        const nuevoIdAlmacen = await agregarAlmacen(almacen);
        if (!nuevoIdAlmacen) {
          Alert.alert("Error", "No se pudo agregar el nuevo almacén.");
          return;
        }
        idAlmacenFinal = nuevoIdAlmacen;
      }

      // Verificamos obra
      let otObraFinal = otObra;
      const obraExistente = otObras.find((o) => o.ot === otObra);
      if (!obraExistente) {
        const nuevaOtObra = await agregarObra(otObra, descripcionObra);
        if (!nuevaOtObra) {
          Alert.alert("Error", "No se pudo agregar la nueva obra.");
          return;
        }
        otObraFinal = nuevaOtObra;
      }

      // Verificamos si el producto ya existe por matrícula
      const productoExistente = await obtenerProductoPorId(id);

      let productoIdFinal = id;

      if (productoExistente) {
        // ✅ Si ya existe por matrícula, lo actualizamos
        const actualizado = await actualizarProducto(
          id,
          matricula,
          observaciones
        );

        if (!actualizado) {
          Alert.alert("Error", "No se pudo actualizar el producto.");
          return;
        }

        console.log("✅ Producto actualizado correctamente.");
      } else {
        // 🛑 Validación adicional: evitar duplicado por ID
        const productoPorId = await obtenerProductoPorId(id);

        if (productoPorId) {
          Alert.alert(
            "Error",
            "Ya existe un producto con este ID. No puedes duplicar datos."
          );
          return;
        }

        // ✅ Insertar producto nuevo
        const productoInsertado = await agregarProducto(
          id,
          matricula,
          observaciones,
          idAlmacenFinal,
          otObraFinal
        );

        if (!productoInsertado) {
          Alert.alert("Error", "No se pudo insertar el nuevo producto.");
          return;
        }

        console.log("✅ Producto insertado correctamente con ID:", id);
        productoIdFinal = id; // ← usar directamente el ID manual introducido
      }

      // Registrar estado con ID correcto
      const usuarioProductoRegistrado = await registrarUsuarioProducto(
        id_user,
        productoIdFinal,
        estadoCapitalizado,
        fecha
      );

      if (!usuarioProductoRegistrado) {
        Alert.alert("Error", "No se pudo registrar el estado del producto.");
        return;
      }

      Alert.alert("✅ Éxito", "Datos guardados correctamente.");
      navigation.navigate("Home");
    } catch (error) {
      console.error("❌ Error general en guardado:", error);
      Alert.alert("Error", "Ocurrió un problema al guardar los datos.");
    }
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

        <Text style={styles.label}>Número Identificador:</Text>
        <TextInput
          style={styles.input}
          value={id}
          onChangeText={setId}
          editable={!validado}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Matrícula:</Text>
        <View style={styles.matriculaContainer}>
          <TextInput
            value={matricula}
            onChangeText={setMatricula}
            editable={validado && estado === "Recibido"}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.staticText}>{estado}</Text>

        <Text style={styles.label}>Almacén:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%", textAlignVertical: "center" }}
            value={
              almacenes.find((item) => item.id === almacen)?.nombre || almacen
            }
            onChangeText={setAlmacen} // Permite escribir manualmente
            placeholder="Introduce o selecciona Almacén"
            editable={validado && estado === "Recibido"} // Permite edición antes de guardar
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
                      onValueChange={(itemValue) => setAlmacen(itemValue)}
                    >
                      <Picker.Item
                        label="Selecciona un Almacén"
                        value="custom"
                      />
                      {almacenes.map((item, index) => (
                        <Picker.Item
                          key={`${item.id}-${index}`}
                          label={item.nombre}
                          value={item.id}
                        />
                      ))}
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
              selectedValue={almacen}
              onValueChange={(itemValue) => setAlmacen(itemValue)}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "Recibido"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Almacén" value="custom" />
              {almacenes
                .filter((item) => item.id) // Filtra valores vacíos
                .map((item) => (
                  <Picker.Item
                    key={`almacen-${item.id}`}
                    label={item.nombre}
                    value={item.id}
                  />
                ))}
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
            editable={validado && estado === "Recibido"}
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
                      onValueChange={(itemValue) => setOtObra(itemValue)}
                    >
                      <Picker.Item
                        label="Selecciona una OT de obra"
                        value="custom"
                      />
                      {otObras
                        .filter((item) => item.ot) // Filtra valores vacíos
                        .map((item) => (
                          <Picker.Item
                            key={`obra-${item.ot}`}
                            label={item.ot} // solo el número OT
                            value={item.ot}
                          />
                        ))}
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
              enabled={validado && estado === "Recibido"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona una OT de obra" value="custom" />
              {otObras.map((item) => (
                <Picker.Item key={item.ot} label={item.ot} value={item.ot} />
              ))}
            </Picker>
          )}
        </View>

        <Text style={styles.label}>Descripción Obra:</Text>
        <TextInput
          style={styles.input}
          value={descripcionObra}
          onChangeText={setDescripcionObra}
          editable={validado && estado === "Recibido"}
        />

        <Text style={styles.label}>Información Recibido:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%", textAlignVertical: "center" }}
            value={empleadoRecibido}
            onChangeText={setEmpleadoRecibido}
            placeholder="Introduce o selecciona Empleados"
            editable={validado && estado === "Recibido"}
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
                        setEmpleadoRecibido(itemValue); // Guarda selección en el campo
                        setFechaRecibido(getCurrentDateTime()); // Guarda la fecha
                        setShowEmpleadoRecibidoPicker(false);
                      }}
                    >
                      <Picker.Item label="Selecciona un Empleado" value="" />
                      {empleados
                        .filter((item) => item.id) // Filtra valores vacíos
                        .map((item) => (
                          <Picker.Item
                            key={`empleado-${item.id}`}
                            label={item.nombre}
                            value={item.nombre}
                          />
                        ))}
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
              onValueChange={(itemValue) => {
                setEmpleadoRecibido(itemValue);
                setFechaRecibido(getCurrentDateTime());
              }}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "Recibido"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              {empleados.map((item) => (
                <Picker.Item
                  key={`empleado-${item.id}`}
                  label={item.nombre}
                  value={item.nombre}
                />
              ))}
            </Picker>
          )}
        </View>
        <Text style={styles.staticText}>{fechaRecibido}</Text>

        <Text style={styles.label}>Información Para Devolver:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%", textAlignVertical: "center" }}
            value={empleadoParaDevolver}
            onChangeText={setEmpleadoParaDevolver} // Permite escritura manual
            placeholder="Introduce o selecciona Empleados"
            editable={validado && estado === "Para Devolver"} // Permite edición antes de guardar
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
                        setFechaParaDevolver(getCurrentDateTime());
                        setShowEmpleadoParaDevolverPicker(false);
                      }}
                    >
                      <Picker.Item label="Selecciona un Empleado" value="" />
                      {empleados
                        .filter((item) => item.id) // Filtra valores vacíos
                        .map((item) => (
                          <Picker.Item
                            key={`empleado-${item.id}`}
                            label={item.nombre}
                            value={item.nombre}
                          />
                        ))}
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
              onValueChange={(itemValue) => {
                setEmpleadoParaDevolver(itemValue);
                setFechaParaDevolver(getCurrentDateTime());
              }}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "Para Devolver"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              {empleados
                .filter((item) => item.id) // Filtra valores vacíos
                .map((item) => (
                  <Picker.Item
                    key={`empleado-${item.id}`}
                    label={item.nombre}
                    value={item.nombre}
                  />
                ))}
            </Picker>
          )}
        </View>
        <Text style={styles.staticText}>{fechaParaDevolver}</Text>

        <Text style={styles.label}>Información Devuelto:</Text>
        <View
          style={[styles.input, { flexDirection: "row", alignItems: "center" }]}
        >
          <TextInput
            style={{ flex: 1, height: "100%", textAlignVertical: "center" }}
            value={empleadoDevuelto}
            onChangeText={setEmpleadoDevuelto} // Permite escritura manual
            placeholder="Introduce o selecciona Empleados"
            editable={validado && estado === "Devuelto"} // Permite edición antes de guardar
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
                        setFechaDevuelto(getCurrentDateTime());
                        setShowEmpleadoDevueltoPicker(false);
                      }}
                    >
                      <Picker.Item label="Selecciona un Empleado" value="" />
                      {empleados
                        .filter((item) => item.id) // Filtra valores vacíos
                        .map((item) => (
                          <Picker.Item
                            key={`empleado-${item.id}`}
                            label={item.nombre}
                            value={item.nombre}
                          />
                        ))}
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
              onValueChange={(itemValue) => {
                setEmpleadoDevuelto(itemValue);
                setFechaDevuelto(getCurrentDateTime());
              }}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "Devuelto"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              {empleados
                .filter((item) => item.id) // Filtra valores vacíos
                .map((item) => (
                  <Picker.Item
                    key={`empleado-${item.id}`}
                    label={item.nombre}
                    value={item.nombre}
                  />
                ))}
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
