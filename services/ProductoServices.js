import { API_HISTORIAL, API_PRODUCTO } from "../Config/Config";

export const obtenerProductoPorId = async (id) => {
  try {
    console.log(`🔹 Buscando historial del producto con ID: ${id}`);
    const response = await fetch(`${API_HISTORIAL}/id/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("⚠️ Producto no encontrado por ID");
        return null;
      }

      console.warn(
        `⚠️ Error HTTP (${response.status}) al buscar ID. Tratando como no encontrado.`
      );
      return null; // ← esto evita el error y continúa como si no existiera
    }

    const data = await response.json();
    console.log("🔹 Historial por ID obtenido:", data);
    return data;
  } catch (error) {
    console.error("❌ Error obteniendo historial por ID:", error);
    return null;
  }
};

// **Obtener información de un producto desde HISTORIAL**
export const obtenerProductoPorMatricula = async (matricula) => {
  try {
    console.log(
      `🔹 Buscando historial del producto con matrícula: ${matricula}`
    );
    const response = await fetch(
      `${API_HISTORIAL}/matricula/${matricula.toString()}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn("⚠️ Producto no encontrado (404)");
        return null;
      }
      console.error("❌ Error HTTP al obtener producto:", response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 Historial del producto obtenido:", data);
    return data;
  } catch (error) {
    console.error("❌ Error obteniendo historial del producto:", error);
    return null;
  }
};
export const obtenerHistorialProductos = async () => {
  try {
    console.log("🔹 Obteniendo historial completo de productos...");
    const response = await fetch(API_HISTORIAL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Historial completo recibido:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al obtener historial de productos:", error);
    throw error;
  }
};
export const agregarProducto = async (
  id,
  matricula,
  observaciones,
  iD_Almacen,
  iD_Obra
) => {
  try {
    if (!id || !matricula || !observaciones || !iD_Almacen || !iD_Obra) {
      console.error("❌ Error: Datos obligatorios faltantes:", {
        id,
        matricula,
        observaciones,
        iD_Almacen,
        iD_Obra,
      });
      return false;
    }

    const dataToSend = {
      id: id, // ✅ NUEVO CAMPO
      matricula: matricula,
      observaciones: observaciones,
      almacen_id: iD_Almacen,
      obra_ot: iD_Obra,
    };

    console.log("📌 Enviando nuevo producto a la API:", dataToSend);

    const response = await fetch(API_PRODUCTO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "❌ Error al insertar producto:",
        response.status,
        errorText
      );
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Producto insertado correctamente:", data);
    return true;
  } catch (error) {
    console.error("❌ Error insertando producto:", error);
    return false;
  }
};

export const actualizarProducto = async (id, matricula, observaciones) => {
  try {
    console.log(
      `🔹 Actualizando producto con ID: ${id}, Matricula: ${matricula}`
    );

    const dataToUpdate = {
      observaciones: observaciones,
    };

    console.log("📌 Datos enviados a la API para actualización:", dataToUpdate);
    console.log(JSON.stringify(dataToUpdate));

    const response = await fetch(`${API_PRODUCTO}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToUpdate),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "❌ Error al actualizar producto:",
        response.status,
        errorText
      );
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    console.log("✅ Producto actualizado correctamente.");
    return true;
  } catch (error) {
    console.error("❌ Error actualizando producto:", error);
    return false;
  }
};
