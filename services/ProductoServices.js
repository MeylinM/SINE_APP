const API_URL = "http://192.168.10.101:3000/producto";

// Obtener información de un producto por matrícula
export const obtenerProductoPorMatricula = async (matricula) => {
  try {
    console.log(`🔹 Buscando producto con matrícula: ${matricula}`);
    const response = await fetch(`${API_URL}/${matricula}`);

    if (!response.ok) {
      console.error("❌ Error HTTP al obtener producto:", response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 Producto obtenido:", data);
    return data;
  } catch (error) {
    console.error("❌ Error obteniendo producto:", error);
    return null;
  }
};

// Insertar un nuevo producto si no existe
export const agregarProducto = async (
  matricula,
  observaciones,
  ID_Almacen,
  ID_Obra
) => {
  try {
    console.log(`🔹 Insertando nuevo producto: ${matricula}`);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matricula, observaciones, ID_Almacen, ID_Obra }),
    });

    if (!response.ok) {
      console.error("❌ Error al insertar producto:", response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Producto insertado correctamente:", data);
    return true;
  } catch (error) {
    console.error("❌ Error insertando producto:", error);
    return false;
  }
};

// Actualizar estado y observaciones de un producto
export const actualizarProducto = async (
  matricula,
  estado,
  observaciones,
  ID_Almacen,
  ID_Obra
) => {
  try {
    console.log(`🔹 Actualizando producto ${matricula} con estado: ${estado}`);
    const response = await fetch(`${API_URL}/${matricula}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado, observaciones, ID_Almacen, ID_Obra }),
    });

    if (!response.ok) {
      console.error("❌ Error al actualizar producto:", response.status);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    console.log("✅ Producto actualizado correctamente.");
    return true;
  } catch (error) {
    console.error("❌ Error actualizando producto:", error);
    return false;
  }
};
