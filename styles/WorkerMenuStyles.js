import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerImage: {
    position: "absolute", // Se superpone al título
    top: 0, // Arriba
    width: "112%", // La imagen ocupa todo el ancho
    height: 300, // 🔹 Reduje la altura para dar más espacio
    resizeMode: "cover", // Ajusta sin distorsionarse
    marginBottom: 15, // 🔹 Acerca la imagen al título
  },
  title: {
    fontSize: 22, // 🔹 Ligeramente más pequeño
    fontWeight: "bold",
    color: "#4a4a4a",
    marginTop: 270, // 🔹 Ajustado para compensar el cambio en la imagen
    marginBottom: 25, // 🔹 Menos espacio debajo del título
    textAlign: "center",
  },
  button: {
    backgroundColor: "#019edf",
    paddingVertical: 15, // 🔹 Reducido para hacer los botones más pequeños
    paddingHorizontal: 25, // 🔹 Ajustado para mantener proporción
    borderRadius: 20, // 🔹 Ligeramente menor para un mejor ajuste
    width: "75%", // 🔹 Más estrecho para que entren mejor
    alignItems: "center",
    marginBottom: 20, // 🔹 Menos espacio entre botones
  },
  footer: {
    position: "absolute", // Se superpone al botón
    bottom: 15, // 🔹 Más arriba para dar espacio
    fontSize: 12, // 🔹 Más pequeño para que no ocupe mucho
    color: "#0096FF",
    textAlign: "center",
  },
});
