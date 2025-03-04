import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen"; // ✅ Pantalla principal
import Camara from "./Camara"; // ✅ Pantalla de la cámara
import DatosQR from "./DatosQR"; // ✅ Pantalla de detalles del QR

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camara" component={Camara} />
        <Stack.Screen name="DatosQR" component={DatosQR} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

