const API_URL = "http://192.168.10.101:3000/historial";

// Obtener todos los registros de la vista `vista_historial_productos`
export const obtenerHistorialProductos = async () => {
  try {
    console.log("🔹 Obteniendo historial de productos...");
    const response = await fetch(API_URL);

    if (!response.ok) {
      console.error("❌ Error HTTP al obtener historial:", response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 Historial obtenido:", data);
    return data;
  } catch (error) {
    console.error("❌ Error obteniendo historial de productos:", error);
    return [];
  }
};
