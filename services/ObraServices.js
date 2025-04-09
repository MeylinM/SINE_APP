import { API_OBRA } from "../Config/Config";

// Obtener todas las obras
export const obtenerOtObras = async () => {
  try {
    console.log("🔹 Obteniendo obras desde la base de datos...");
    const response = await fetch(API_OBRA);

    if (!response.ok) {
      console.error("❌ Error HTTP al obtener obras:", response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 Obras obtenidas:", data);
    return data;
  } catch (error) {
    console.error("❌ Error obteniendo obras:", error);
    return [];
  }
};

// Obtener una obra por OT
export const obtenerObraPorOT = async (ot) => {
  try {
    console.log(`🔹 Obteniendo obra con OT: ${ot}`);
    const response = await fetch(`${API_OBRA}/${ot}`);

    if (!response.ok) {
      console.error(`❌ Error HTTP al obtener obra OT ${ot}:`, response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 Obra obtenida:", data);
    return data;
  } catch (error) {
    console.error(`❌ Error obteniendo obra con OT ${ot}:`, error);
    return null;
  }
};

// Insertar una nueva obra en la base de datos si no existe
export const agregarObra = async (ot, descripcion) => {
  try {
    console.log(
      `🔹 Intentando agregar obra: OT ${ot}, Descripción: ${descripcion}`
    );
    const response = await fetch(API_OBRA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ot, descripcion }),
    });

    if (!response.ok) {
      console.error("❌ Error al agregar obra:", response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Obra agregada correctamente:", data);
    return data.ot; // Retorna el OT de la obra insertada
  } catch (error) {
    console.error("❌ Error agregando obra:", error);
    return null;
  }
};
