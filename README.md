# ⚡ Gestión de Bobinas – SINE Ingeniería

Aplicación móvil desarrollada con **React Native + Expo**, orientada a la **gestión de bobinas de madera**. Permite registrar entradas y salidas mediante **escaneo QR** o **introducción manual**, con seguimiento de estados, empleados y observaciones.

---

## 📱 Funcionalidades principales

- 📷 Escaneo de bobinas mediante QR
- ✍️ Introducción manual de datos
- 🔄 Flujo lógico de estados:
  - `null` → `Recibido` → `Para Devolver` → `Devuelto`
- 🧑‍💼 Registro de empleados por estado
- 🗒️ Observaciones históricas por bobina
- 🔍 Filtros por matrícula, estado y empleado
- 📊 Visualización del historial completo
- 🔐 Validación para evitar duplicados y entradas inválidas

---

## 🧠 Tecnologías y librerías utilizadas

| Librería / Herramienta                 | Función principal                             |
| -------------------------------------- | --------------------------------------------- |
| [Expo](https://expo.dev/)              | Framework de desarrollo sobre React Native    |
| React Native                           | Base del desarrollo móvil                     |
| `expo-camera`                          | Escaneo de códigos QR                         |
| `expo-screen-orientation`              | Bloqueo de orientación por pantalla           |
| `@react-navigation/native`             | Navegación entre pantallas                    |
| `react-native-modal-selector`          | Selectores visuales                           |
| `react-native-webview`                 | Visualización del manual embebido             |
| `expo-status-bar`, `safe-area-context` | Ajustes visuales seguros y adaptativos        |
| API REST (Railway + Node.js)           | Backend en la nube para lógica y persistencia |

---

## 📁 Estructura principal del proyecto

```
SINE_APP/
├── assets/                          # Recursos estáticos del proyecto
│   ├── manual/                      # Manual de usuario en HTML + CSS
│   │   ├── css/
│   │   │   └── BobinaCL.css
│   │   └── html/
│   │       └── ManualBobinas.html
│   └── fotos/                       # Imágenes internas (QRs, pruebas)
│
├── config/
│   └── config.js                    # URLs centralizadas de la API
│
├── screens/                         # Pantallas principales
│   ├── HomeScreen.js
│   ├── Camara.js
│   ├── DatosManuales.js
│   ├── DatosQR.js
│   ├── AllDataTable.js
│   ├── ParaDevolverTabla.js
│   └── PantallaManual.js
│
├── services/                        # Servicios para llamadas a la API REST
│   ├── AlmacenesServices.js
│   ├── EmpleadoServices.js
│   ├── ObraServices.js
│   ├── ProductoServices.js
│   └── UsuarioRegistroServices.js
│
├── Styles/
│   └── estilos/                     # Estilos agrupados por módulo
│
├── App.js                           # Entrada principal
├── app.json                         # Configuración global Expo
└── .gitignore                       # Ignorados por Git
```

---

## ⚙️ Instalación del proyecto

```bash
git clone https://github.com/MeylinM/SINE_APP.git
cd SINE_APP
npm install
npx expo start
```

> Asegúrate de tener instalados [Node.js](https://nodejs.org) y [Expo CLI](https://docs.expo.dev/get-started/installation/)

---

## 🔐 Configuración de endpoints

Crea el archivo `/config/config.js` con el siguiente contenido:

```js
const BASE_URL = "https://sineserver-production.up.railway.app";

export const API_HISTORIAL = `${BASE_URL}/historial`;
export const API_PRODUCTO = `${BASE_URL}/producto`;
export const API_ALMACEN = `${BASE_URL}/almacen`;
export const API_OBRA = `${BASE_URL}/obra`;
export const API_USUARIO = `${BASE_URL}/usuario/activos`;
export const API_USUARIO_PRODUCTO = `${BASE_URL}/usuario_producto`;
```

> Este archivo puede estar excluido del repositorio si lo añades al `.gitignore`.

---

## 📦 Compilación para producción

```bash
eas build --platform android --clear-cache
```

- El icono debe estar en `assets/icon_expo_ready.png`
- El nombre de la app y el package ID están definidos en `app.json`

---

## 📲 Instalación en dispositivos

Puedes usar **Expo Go** para pruebas locales:

```bash
npx expo start
```

O instalar el `.apk` generado con `eas build` directamente en Android.

---

## 🧪 Pruebas recomendadas

- Escanear bobina con QR y validar el flujo de estados
- Introducir bobina manualmente
- Añadir y visualizar observaciones
- Comprobar comportamiento del botón “atrás” en pantallas críticas
- Verificar funcionamiento de filtros en `AllDataTable`

---

## 💡 Buenas prácticas aplicadas

- Centralización de URLs en `/config/config.js`
- Uso de `navigation.reset()` para evitar navegación hacia pantallas previas
- Icono y splash screen bien definidos en `app.json`
- Código organizado por pantallas, servicios y estilos
- `console.log`, `console.warn`, `console.error` usados para depuración

---

## 🙋‍♂️ Autoría

Desarrollado por el equipo de **iHodei.com**  
Para uso exclusivo de **SINE Ingeniería Eléctrica**

Repositorio oficial:  
[https://github.com/MeylinM/SINE_APP](https://github.com/MeylinM/SINE_APP)

---

## 🛡️ Licencia

Este software es de uso **privado**.  
No está autorizado su uso, copia ni distribución fuera del entorno autorizado por SINE Ingeniería.
