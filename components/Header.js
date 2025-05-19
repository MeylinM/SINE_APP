import React from "react";
import { View, Image } from "react-native";
import styles from "../styles/headerStyles"; // Importamos los estilos

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Image source={require("../assets/header-image.png")} style={styles.headerImage} />
    </View>
  );
}
