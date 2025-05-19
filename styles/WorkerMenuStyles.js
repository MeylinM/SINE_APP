import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerImage: {
    position: "absolute",
    top: 0,
    width: "112%",
    height: 300,
    resizeMode: "cover",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginTop: 270,
    marginBottom: 25,
    textAlign: "center",
    width: "85%", // 🔹 Controla la anchura para evitar desbordes
    alignSelf: "center", // 🔹 Centrado horizontal
  },
  button: {
    backgroundColor: "#019edf",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    width: "75%",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center", // 🔹 Centrado horizontal
  },
  footer: {
    position: "absolute",
    bottom: 15,
    fontSize: 12,
    color: "#0096FF",
    textAlign: "center",
    width: "85%", // 🔹 Mismo ancho que el título
    alignSelf: "center", // 🔹 Centrado horizontal
  },
  helpButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  helpButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
