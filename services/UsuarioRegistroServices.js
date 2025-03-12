const API_URL = "http://192.168.10.101:3000/usuario_producto";

// Registrar un nuevo evento en UsuarioProducto
export const registrarUsuarioProducto = async (
  id_user,
  matricula,
  registro,
  fecha
) => {
  try {
    if (!id_user || !matricula || !registro || !fecha) {
      console.error("❌ Datos incompletos para registrar UsuarioProducto:", {
        id_user,
        matricula,
        registro,
        fecha,
      });
      return false;
    }

    console.log("🔹 Registrando acción en UsuarioProducto:", {
      id_user,
      matricula,
      registro,
      fecha,
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_user, matricula, registro, fecha }),
    });

    if (!response.ok) {
      console.error(
        "❌ Error al registrar evento en UsuarioProducto:",
        response.status
      );
      throw new Error(`Error HTTP: ${response.status}`);
    }

    console.log("✅ Evento registrado en UsuarioProducto.");
    return true;
  } catch (error) {
    console.error("❌ Error registrando evento en UsuarioProducto:", error);
    return false;
  }
};
