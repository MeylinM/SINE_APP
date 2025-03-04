import { View, Text, StyleSheet, Button } from "react-native";

const DatosQR = ({ route, navigation }) => {
  const { qrData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>Datos escaneados:</Text>
      <Text>{qrData}</Text>
      <Button title="Volver al inicio" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default DatosQR;
