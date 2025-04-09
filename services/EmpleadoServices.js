import { API_USUARIO } from "../Config/Config";

// Obtener todos los empleados desde la base de datos
export const obtenerEmpleados = async () => {
  try {
    console.log("Obteniendo empleados desde la base de datos...");
    const response = await fetch(API_USUARIO);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Empleados obtenidos:", data);

    // Comprobamos si la respuesta tiene datos correctos
    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      console.error("❌ Error: La respuesta no contiene empleados.");
      return [];
    }
  } catch (error) {
    console.error("Error obteniendo empleados:", error);
    return []; // Retorna un array vacío para evitar fallos en la UI
  }
};
