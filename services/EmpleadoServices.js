const API_URL = "http://192.168.10.101:3000/usuario";

// Obtener todos los empleados desde la base de datos
export const obtenerEmpleados = async () => {
  try {
    console.log("Obteniendo empleados desde la base de datos...");
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Empleados obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error obteniendo empleados:", error);
    return []; // Retorna un array vacío para evitar fallos en la UI
  }
};
