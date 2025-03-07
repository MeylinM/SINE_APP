import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA", // 🔹 Fondo claro para mejor contraste
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565C0",
    marginTop: 10,
  },
  staticText: {
    fontSize: 16,
    color: "#424242",
    padding: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#1565C0",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  matriculaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1565C0",
    borderRadius: 5,
    backgroundColor: "white",
    paddingHorizontal: 10,
    height: 40, // 🔹 Mantiene la altura estándar
  },

  matriculaInput: {
    flex: 1, // 🔹 Ocupará todo el espacio restante
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 16,
  },

  validateButton: {
    position: "absolute",
    right: 10, // 🔹 Mantiene la lupa/check a la derecha dentro del campo
    height: 30, // 🔹 Hace el botón un poco más pequeño
    width: 30, // 🔹 Reduce el tamaño total del botón
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  validateButtonChecked: {
    backgroundColor: "#BBDEFB", // 🔥 Azul claro en lugar de verde
    borderColor: "#BBDEFB", // 🔹 También cambia el borde a azul claro
  },

  validateButtonTextChecked: {
    color: "#1565C0", // 🔹 Azul más oscuro para el ✔
    fontSize: 16, // 🔹 Reduce ligeramente el tamaño del ✔
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
});
