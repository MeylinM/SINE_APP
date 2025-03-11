import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    marginTop: 5,
    fontSize: 20, // Reducimos un poco el tamaño del título
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    textAlign: "center",
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "90%",
    alignItems: "center",
    marginBottom: 5,
    gap: 100,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "25%",
    fontSize: 12,
    fontFamily: "sans-serif",
    textAlign: "center",
    height: 30, // Aseguramos que el alto sea consistente
  },
  pickerContainer: {
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "25%",
    alignSelf: "center",
    height: 30, // Asegura que el Picker tenga la misma altura que los inputs
    justifyContent: "center", // Centra el contenido dentro del Picker
  },
  pickerText: {
    padding: 5,
    fontSize: 12,
    color: "#333",
    height: "100%",
  },
  pickerTouchable: {
    flexDirection: "row",
    justifyContent: "space-between", // Asegura que el texto y la flecha estén separados
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
  },
  table: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5, // Reducimos el padding interno de la tabla
    marginBottom: 15, // Menos espacio entre la tabla y los botones
    width: 2000,
    height: 235,
    borderWidth: 2,
    borderColor: "#019edf",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#019edf",
    paddingVertical: 8, // Reduce la altura de la cabecera
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    paddingVertical: 4, // Hace que las celdas sean más delgadas
    borderRightWidth: 1,
    borderRightColor: "#fff",
    fontSize: 12, // Reducimos el tamaño del texto en los headers
  },
  headerGroup: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#fff",
  },
  headerCellBig: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    paddingVertical: 4,
    fontSize: 12,
    backgroundColor: "#019edf",
    width: "100%",
  },
  subHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#017bb5",
    width: "100%",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  subHeaderCell: {
    flex: 1,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    paddingVertical: 4,
    fontSize: 11,
    borderRightWidth: 1,
    borderRightColor: "#fff",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 3,
    fontSize: 11, // Reducimos el tamaño del texto dentro de las celdas
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 5,
    marginBottom: 10,
    gap: 15,
  },
  button: {
    backgroundColor: "#019edf",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    width: "35%", // Ajustamos un poco más el tamaño de los botones
    alignItems: "center",
  },
});
