import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E3F2FD", // Azul claro
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0D47A1", // Azul oscuro
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565C0", // Azul intermedio
    marginTop: 10,
  },
  staticText: {
    fontSize: 16,
    color: "#424242",
    padding: 10,
    backgroundColor: "#BBDEFB", // Fondo azul claro
    borderRadius: 5,
    marginTop: 5,
  },
  input: {
    height: 40,
    borderColor: "#1565C0",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  picker: {
    height: 40,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
