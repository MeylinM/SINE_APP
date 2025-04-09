import { API_ALMACEN } from "../Config/Config";

// Obtener todos los almacenes
export const obtenerAlmacenes = async () => {
  try {
    console.log("🔹 Obteniendo almacenes desde la base de datos...");
    const response = await fetch(`${API_ALMACEN}/activos`);

    if (!response.ok) {
      console.error("❌ Error HTTP al obtener almacenes:", response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 Almacenes obtenidos:", data);
    return data;
  } catch (error) {
    console.error("❌ Error obteniendo almacenes:", error);
    return [];
  }
};
export const obtenerTodosLosAlmacenes = async () => {
  try {
    const response = await fetch(`${API_ALMACEN}`); // sin `/activos`
    if (!response.ok) {
      console.error(
        "❌ Error HTTP al obtener todos los almacenes:",
        response.status
      );
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error al obtener todos los almacenes:", error);
    return [];
  }
};

// Obtener un almacén por ID
export const obtenerAlmacenPorID = async (id) => {
  try {
    console.log(`🔹 Obteniendo almacén con ID: ${id}`);
    const response = await fetch(`${API_ALMACEN}/${id}`);

    if (!response.ok) {
      console.error(
        `❌ Error HTTP al obtener almacén ID ${id}:`,
        response.status
      );
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 Almacén obtenido:", data);
    return data;
  } catch (error) {
    console.error(`❌ Error obteniendo almacén con ID ${id}:`, error);
    return null;
  }
};

// Insertar un nuevo almacén en la base de datos si no existe
export const agregarAlmacen = async (nombre) => {
  try {
    console.log(`🔹 Intentando agregar almacén: ${nombre}`);
    const response = await fetch(API_ALMACEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });

    if (!response.ok) {
      console.error("❌ Error al agregar almacén:", response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Almacén agregado correctamente:", data);
    return data.id; // Retorna el ID del almacén insertado
  } catch (error) {
    console.error("❌ Error agregando almacén:", error);
    return null;
  }
};
