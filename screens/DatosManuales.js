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
import { obtenerAlmacenes } from "../services/AlmacenesServices";
import { obtenerOtObras } from "../services/ObraServices";
import { obtenerEmpleados } from "../services/EmpleadoServices";
import {
  obtenerProductoPorMatricula,
  actualizarProducto,
} from "../services/ProductoServices";
import { registrarUsuarioProducto } from "../services/UsuarioRegistroServices";

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
  const [almacenes, setAlmacenes] = useState([]);
  const [otObras, setOtObras] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  const validarMatricula = async () => {
    if (!matricula.trim()) {
      Alert.alert("Error", "Introduce una matrícula válida.");
      return;
    }

    try {
      // **Cargar datos de la API**
      const almacenesDB = await obtenerAlmacenes();
      const otObrasDB = await obtenerOtObras();
      const empleadosDB = await obtenerEmpleados();

      setAlmacenes(almacenesDB);
      setOtObras(otObrasDB);
      setEmpleados(empleadosDB);

      // **Buscar la matrícula en la BD**
      const producto = await obtenerProductoPorMatricula(matricula);

      let nuevoEstado = "RECIBIDO";
      let nuevaFechaParaDevolver = "";
      let nuevaFechaDevuelto = "";

      if (producto) {
        switch (producto.estado) {
          case "RECIBIDO":
            nuevoEstado = "PARA DEVOLVER";
            nuevaFechaParaDevolver = getCurrentDateTime();
            break;
          case "PARA DEVOLVER":
            nuevoEstado = "DEVUELTO";
            nuevaFechaDevuelto = getCurrentDateTime();
            break;
          case "DEVUELTO":
            nuevoEstado = "DEVUELTO";
            break;
          default:
            nuevoEstado = "RECIBIDO";
        }

        setAlmacen(producto.ID_Almacen || "");
        setOtObra(producto.ID_Obra || "");
        setDescripcionObra(producto.descripcion || "");
        setEstado(nuevoEstado);
        setEmpleadoRecibido(producto.empleadoRecibido || "");
        setFechaRecibido(producto.fechaRecibido || "");
        setEmpleadoParaDevolver(producto.empleadoParaDevolver || "");
        setFechaParaDevolver(
          nuevaFechaParaDevolver || producto.fechaParaDevolver || ""
        );
        setEmpleadoDevuelto(producto.empleadoDevuelto || "");
        setFechaDevuelto(nuevaFechaDevuelto || producto.fechaDevuelto || "");
        setObservaciones(producto.observaciones || "");
      } else {
        setFechaRecibido(getCurrentDateTime());
        setEstado("RECIBIDO");
      }

      setValidado(true);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo cargar la información desde la base de datos."
      );
    }
  };

  const [datosGuardadosTemporalmente, setDatosGuardadosTemporalmente] =
    useState(null);

  const handleGuardar = async () => {
    if (!validado) {
      Alert.alert("Error", "Debes validar la matrícula antes de guardar.");
      return;
    }

    const fecha = getCurrentDateTime(); // Obtener la fecha actual

    try {
      console.log("🔹 Iniciando proceso de guardado...");
      console.log("🔹 Matricula:", matricula);
      console.log("🔹 Estado:", estado);
      console.log("🔹 Observaciones:", observaciones);
      console.log("🔹 Almacén ingresado:", almacen);
      console.log("🔹 OT Obra ingresada:", otObra);

      let idObra = null;
      let idAlmacen = null;

      // **1. Verificar si la OT Obra ya existe en la tabla `Obra`**
      if (otObra.trim() !== "") {
        const obrasDB = await obtenerOtObras();
        const obraExistente = obrasDB.find((obra) => obra.ot === otObra);

        if (!obraExistente) {
          console.log(
            `⚡ Agregando nueva obra: OT ${otObra}, Descripción: ${descripcionObra}`
          );
          idObra = await agregarObra(otObra, descripcionObra);
          if (!idObra) {
            Alert.alert(
              "Error",
              "No se pudo registrar la obra en la base de datos."
            );
            return;
          }
        } else {
          idObra = obraExistente.ot;
        }
      }

      // **2. Verificar si el Almacén ya existe en la tabla `Almacén`**
      if (almacen.trim() !== "") {
        const almacenesDB = await obtenerAlmacenes();
        const almacenExistente = almacenesDB.find(
          (alm) => alm.nombre === almacen
        );

        if (!almacenExistente) {
          console.log(`⚡ Agregando nuevo almacén: ${almacen}`);
          idAlmacen = await agregarAlmacen(almacen);
          if (!idAlmacen) {
            Alert.alert(
              "Error",
              "No se pudo registrar el almacén en la base de datos."
            );
            return;
          }
        } else {
          idAlmacen = almacenExistente.id;
        }
      }

      console.log("✅ IDs después de validación:");
      console.log("   - ID Almacén:", idAlmacen);
      console.log("   - ID Obra:", idObra);

      // **3. Verificar si el Producto ya existe en la BD antes de actualizar**
      const productoExistente = await obtenerProductoPorMatricula(matricula);
      if (!productoExistente) {
        console.log(`⚡ Insertando nuevo producto: ${matricula}`);
        const productoInsertado = await agregarProducto(
          matricula,
          observaciones,
          idAlmacen,
          idObra
        );
        if (!productoInsertado) {
          Alert.alert(
            "Error",
            "No se pudo registrar el producto en la base de datos."
          );
          return;
        }
      } else {
        console.log(
          "✅ Producto ya existe en la base de datos, solo se actualizará."
        );
      }

      // **4. Actualizar la tabla `Producto`**
      console.log("📌 Actualizando producto en la base de datos...");
      const productoActualizado = await actualizarProducto(
        matricula,
        estado,
        observaciones,
        idAlmacen,
        idObra
      );

      if (!productoActualizado) {
        Alert.alert("Error", "No se pudo actualizar el producto.");
        return;
      }

      console.log("✅ Producto actualizado correctamente.");

      // **5. Registrar la acción en `UsuarioProducto`**
      let empleadoID = null;
      let registroTipo = "";

      if (estado === "RECIBIDO") {
        empleadoID = empleadoRecibido;
        registroTipo = "RECIBIDO";
      } else if (estado === "PARA DEVOLVER") {
        empleadoID = empleadoParaDevolver;
        registroTipo = "PARA DEVOLVER";
      } else if (estado === "DEVUELTO") {
        empleadoID = empleadoDevuelto;
        registroTipo = "DEVUELTO";
      }

      if (empleadoID) {
        console.log("📌 Registrando en UsuarioProducto...");
        console.log("   - Empleado ID:", empleadoID);
        console.log("   - Matricula:", matricula);
        console.log("   - Tipo de registro:", registroTipo);
        console.log("   - Fecha:", fecha);

        const usuarioProductoGuardado = await registrarUsuarioProducto(
          empleadoID,
          matricula,
          registroTipo,
          fecha
        );

        if (!usuarioProductoGuardado) {
          Alert.alert("Error", "No se pudo registrar la acción del empleado.");
          return;
        }
      }

      Alert.alert(
        "✅ Éxito",
        "Datos guardados correctamente en la base de datos."
      );
      navigation.navigate("Home");
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      Alert.alert(
        "Error",
        "Ocurrió un problema al guardar en la base de datos."
      );
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
                      {almacenes.map((item) => (
                        <Picker.Item
                          key={item.id}
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
              selectedValue={validado ? almacen || "custom" : "disabled"}
              onValueChange={(itemValue) => {
                if (itemValue !== "custom" && itemValue !== "disabled") {
                  setAlmacen(itemValue);
                }
              }}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "RECIBIDO"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Almacén" value="custom" />
              {almacenes.map((item) => (
                <Picker.Item
                  key={item.id}
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
                        label="Selecciona una OT de obra"
                        value="custom"
                      />
                      {otObras.map((item) => (
                        <Picker.Item
                          key={item.ot}
                          label={item.descripcion}
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
              enabled={validado && estado === "RECIBIDO"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona una OT de obra" value="custom" />
              {otObras.map((item) => (
                <Picker.Item
                  key={item.ot}
                  label={item.descripcion}
                  value={item.ot}
                />
              ))}
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
                      {empleados.map((item) => (
                        <Picker.Item
                          key={item.ID}
                          label={item.nombre}
                          value={item.ID}
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
              onValueChange={setEmpleadoRecibido}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "RECIBIDO"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              {empleados.map((item) => (
                <Picker.Item
                  key={item.ID}
                  label={item.nombre}
                  value={item.ID}
                />
              ))}
            </Picker>
          )}
        </View>
        <Text style={styles.staticText}>{fechaRecibido}</Text>

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
                      {empleados.map((item) => (
                        <Picker.Item
                          key={item.ID}
                          label={item.nombre}
                          value={item.ID}
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
              onValueChange={setEmpleadoDevuelto}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "DEVUELTO"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              {empleados.map((item) => (
                <Picker.Item
                  key={item.ID}
                  label={item.nombre}
                  value={item.ID}
                />
              ))}
            </Picker>
          )}
        </View>
        <Text style={styles.staticText}>{fechaDevuelto}</Text>

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
                      {empleados.map((item) => (
                        <Picker.Item
                          key={item.ID}
                          label={item.nombre}
                          value={item.ID}
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
              onValueChange={setEmpleadoParaDevolver}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "PARA DEVOLVER"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              {empleados.map((item) => (
                <Picker.Item
                  key={item.ID}
                  label={item.nombre}
                  value={item.ID}
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
                      {empleados.map((item) => (
                        <Picker.Item
                          key={item.ID}
                          label={item.nombre}
                          value={item.ID}
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
              onValueChange={setEmpleadoDevuelto}
              style={{ width: 30, height: "100%" }}
              enabled={validado && estado === "DEVUELTO"}
              mode="dropdown"
            >
              <Picker.Item label="Selecciona un Empleado" value="" />
              {empleados.map((item) => (
                <Picker.Item
                  key={item.ID}
                  label={item.nombre}
                  value={item.ID}
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
