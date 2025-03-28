const API_URL = "https://sineserver-production.up.railway.app/usuario_producto";

export const registrarUsuarioProducto = async (
  id_user,
  producto_id,
  registro,
  fecha
) => {
  try {
    if (!id_user || !producto_id || !registro || !fecha) {
      console.error("❌ Datos incompletos:", {
        id_user,
        producto_id,
        registro,
        fecha,
      });
      return false;
    }

    const registroCapitalizado =
      registro.charAt(0).toUpperCase() + registro.slice(1).toLowerCase();

    const dataToSend = {
      usuario_id: id_user,
      producto_id: producto_id,
      estado: registroCapitalizado,
      fecha: fecha,
    };

    console.log("📌 Registrando datos en UsuarioProducto:", dataToSend);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "❌ Error al registrar usuario_producto:",
        response.status,
        errorText
      );
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    console.log("✅ Evento registrado en usuario_producto.");
    return true;
  } catch (error) {
    console.error("❌ Error registrando evento en usuario_producto:", error);
    return false;
  }
};
