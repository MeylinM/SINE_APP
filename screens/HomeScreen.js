import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido a la App</Text>
        <Button
          title="Abrir Scanner QR"
          onPress={() => navigation.navigate("Camara")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
