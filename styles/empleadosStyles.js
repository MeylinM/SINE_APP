import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  listContainer: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    padding: 10,
    maxHeight: 450, // Evita que la lista crezca demasiado
    borderWidth: 2,
    borderColor: "#019edf", // Borde azul como en el prototipo
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#019edf", // Azul principal del prototipo
    paddingVertical: 10,
    width: "100%",
    textAlign: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#75c5f0", // Azul claro para resaltar
  },
  disabledButton: {
    backgroundColor: "#ccc", // Botón deshabilitado en gris
  },
  buttonsContainer: {
    width: "90%",
    paddingVertical: 20,
    alignItems: "center",
  },
  // Estilos del Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro translúcido
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#019edf", // Azul para destacar el título
  },
  modalInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#019edf",
    borderRadius: 5,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#019edf",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
