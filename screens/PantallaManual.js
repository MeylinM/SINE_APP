import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export default function ManualBobinas() {
  const [htmlContent, setHtmlContent] = useState(null);
  const [baseUri, setBaseUri] = useState(null);

  // Ruta real de cada imagen: { "Formulario1.jpg": "file://..." }
  const rutaImagenes = {};

  useEffect(() => {
    const archivos = [
      {
        asset: require("../assets/manual/html/ManualBobinas.html"),
        destino: "manual/html/ManualBobinas.html",
      },
      {
        asset: require("../assets/sine_logo.png"),
        destino: "img/sine_logo.png",
      },
      { asset: require("../assets/Header.png"), destino: "img/Header.png" },
      { asset: require("../assets/Footer.png"), destino: "img/Footer.png" },
      {
        asset: require("../assets/EscanerQR.jpg"),
        destino: "img/EscanerQR.jpg",
      },
      {
        asset: require("../assets/Confirmacion.jpg"),
        destino: "img/Confirmacion.jpg",
      },
      {
        asset: require("../assets/Formulario1.jpg"),
        destino: "img/Formulario1.jpg",
      },
      {
        asset: require("../assets/Formulario2.jpg"),
        destino: "img/Formulario2.jpg",
      },
      {
        asset: require("../assets/Formulario3.jpg"),
        destino: "img/Formulario3.jpg",
      },
      {
        asset: require("../assets/Formulario4.jpg"),
        destino: "img/Formulario4.jpg",
      },
      {
        asset: require("../assets/matricula1.jpeg"),
        destino: "img/matricula1.jpeg",
      },
      {
        asset: require("../assets/matricula2.jpg"),
        destino: "img/matricula2.jpg",
      },
      { asset: require("../assets/TodoF.jpg"), destino: "img/TodoF.jpg" },
      { asset: require("../assets/MatF.jpg"), destino: "img/MatF.jpg" },
      { asset: require("../assets/EstF.jpg"), destino: "img/EstF.jpg" },
      { asset: require("../assets/NomF.jpg"), destino: "img/NomF.jpg" },
      { asset: require("../assets/PdF.jpg"), destino: "img/PdF.jpg" },
      { asset: require("../assets/PdMatF.jpg"), destino: "img/PdMatF.jpg" },
      { asset: require("../assets/PdNomF.jpg"), destino: "img/PdNomF.jpg" },
    ];

    const copyAssets = async () => {
      for (const { asset, destino } of archivos) {
        let assetObj;
        try {
          assetObj = Asset.fromModule(asset);
        } catch (err) {
          console.error("❌ Error en require para:", destino);
          throw err;
        }

        await assetObj.downloadAsync();

        const destPath = FileSystem.documentDirectory + destino;
        const destDir = destPath.substring(0, destPath.lastIndexOf("/"));

        await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
        await FileSystem.copyAsync({ from: assetObj.localUri, to: destPath });

        const result = await FileSystem.getInfoAsync(destPath);

        // Guardamos la ruta absoluta para reemplazar en el HTML
        const fileName = destino.split("/").pop();
        rutaImagenes[fileName] = destPath;
      }
    };

    const loadHtml = async () => {
      try {
        await copyAssets();

        const htmlPath =
          FileSystem.documentDirectory + "manual/html/ManualBobinas.html";
        let html = await FileSystem.readAsStringAsync(htmlPath, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // Reemplazar rutas relativas en el HTML por rutas absolutas file://
        for (const fileName in rutaImagenes) {
          const regex = new RegExp(`\\.{2}/\\.{2}/img/${fileName}`, "g");
          html = html.replace(regex, rutaImagenes[fileName]);
        }

        setHtmlContent(html);
        setBaseUri(FileSystem.documentDirectory + "manual/html/");
        console.log("📄 HTML cargado desde:", htmlPath);
      } catch (err) {
        console.error("🚨 Error cargando archivos:", err);
      }
    };

    loadHtml();
  }, []);

  return (
    <View style={styles.container}>
      {htmlContent && baseUri && (
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent, baseUrl: baseUri }}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
