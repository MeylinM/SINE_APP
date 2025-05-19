import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#019edf",
    padding: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center", // 🔹 Centra horizontalmente
    flexWrap: "wrap", // 🔹 Permite que el texto se divida en varias líneas
  },

  input: {
    backgroundColor: "#019edf",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: "center",
  },
});
