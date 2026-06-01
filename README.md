# 🔄 ETL-Basico

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-v8-blue.svg)](https://developers.google.com/apps-script)
[![Clasp](https://img.shields.io/badge/clasp-v2.4-green.svg)](https://github.com/google/clasp)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

Un pipeline de automatización de datos básico desarrollado en **Google Apps Script** bajo la metodología **ETL** (Extract, Transform, Load). Este proyecto está diseñado con fines educativos y de demostración técnica, ilustrando cómo extraer datos tabulares crudos de una hoja de cálculo origen en Google Sheets, procesarlos aplicando reglas de negocio específicas en memoria e inyectarlos de manera óptima en una hoja de cálculo de destino.

---

## 📌 Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Tecnologías Utilizadas](#%EF%B8%F0-tecnologías-utilizadas)
3. [Requisitos Previos](#-requisitos-previos)
4. [Guía de Instalación](#-guía-de-instalación)
5. [Ejecución y Uso](#-ejecución-y-uso)
6. [Estructura del Proyecto](#-estructura-del-proyecto)
7. [Contribución y Licencia](#-contribución-y-licencia)

---

## 🚀 Características Principales

El proyecto implementa un flujo secuencial clásico de ingeniería de datos optimizado para la suite de Google Workspace:

*   **Extracción Síncrona:** Lee la totalidad de los datos crudos de una hoja origen utilizando llamadas directas a la API mediante `getDataRange().getValues()`.
*   **Filtrado por Reglas de Negocio:** Evalúa cada registro del dataset en base a una columna específica (ej. estado `Privado`) para determinar su validez.
*   **Enriquecimiento en Caliente:** Añade metadatos temporales de auditoría (`Fecha de Procesamiento`) a nivel de fila durante la fase de transformación.
*   **Carga Idempotente Inteligente:** Limpia el destino antes de cargar los nuevos datos y realiza una escritura en bloque (`Bulk Write`) para optimizar el uso de cuotas de la API de Google Sheets.

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Plataforma Serverless** | [Google Apps Script](https://developers.google.com/apps-script) | Entorno de ejecución en la nube. |
| **Lenguaje Principal** | JavaScript (ES6+ / V8 Engine) | Lógica funcional de procesamiento de datos. |
| **Almacenamiento e Interfaz** | [Google Sheets](https://www.google.com/sheets/about/) | Base de datos origen y destino. |
| **Herramienta de Despliegue** | [CLASP (Command Line Apps Script)](https://github.com/google/clasp) | Control de versiones local y despliegue al script en la nube. |

---

## 📋 Requisitos Previos

Antes de clonar y desplegar el proyecto, asegúrate de tener instalado en tu máquina local:

*   **Node.js** (versión LTS recomendada, v18.0 o superior). Puedes verificar tu versión con:
    ```bash
    node -v
    ```
*   **npm** (incluido por defecto con Node.js):
    ```bash
    npm -v
    ```
*   **Git** instalado y configurado en tu máquina:
    ```bash
    git --version
    ```
*   Una cuenta de **Google** activa con acceso a **Google Sheets** y **Google Drive**.

---

## 🔧 Guía de Instalación

Sigue estos pasos para clonar el proyecto y vincularlo con tu cuenta de Google Apps Script:

### 1. Clonar el repositorio
Abre una terminal y clona el repositorio del proyecto:
```bash
git clone [URL_DEL_REPOSITORIO]
cd ETL-Basico
```

### 2. Instalar CLASP de forma global (opcional pero recomendado)
Si no tienes la herramienta de comandos de Google Apps Script instalada, instálala globalmente:
```bash
npm install -g @google/clasp
```

### 3. Iniciar sesión en Google a través de CLASP
Inicia sesión en tu cuenta de Google autorizando a CLASP en tu navegador web:
```bash
clasp login
```
*(Asegúrate de tener habilitada la API de Google Apps Script en la configuración del panel de desarrollador de tu cuenta de Google en: https://script.google.com/home/usersettings)*

---

## 💻 Ejecución y Uso

### Configuración del Entorno de Google Sheets
1. Crea dos hojas de cálculo nuevas en tu Google Drive: una para el origen de datos (por ejemplo, con una hoja llamada `DatosCrudos`) y otra para el destino (con una hoja llamada `DatosProcesados`).
2. Copia los IDs de ambas hojas (se encuentran en la URL de cada hoja de cálculo: `https://docs.google.com/spreadsheets/d/ID_AQUÍ/edit`).
3. Modifica la sección `CONFIG` en tu archivo [`Código.js`](file:///d:/Desktop/Proyecto%20Ense%C3%B1anza/ETL-Basico/Código.js) reemplazando los IDs de ejemplo por tus nuevos IDs reales:
```javascript
const CONFIG = {
  origen: {
    spreadsheetId: 'TU_ID_ORIGEN_REAL',
    nombreHoja: 'DatosCrudos',
    filaEncabezados: 1
  },
  destino: {
    spreadsheetId: 'TU_ID_DESTINO_REAL',
    nombreHoja: 'DatosProcesados'
  },
  transformacion: {
    columnaEstadoIndex: 2,
    estadoRequerido: 'Privado'
  }
};
```

### Sincronización con Google Apps Script
Para enviar los archivos del repositorio local a tu script de Google en la nube:
```bash
clasp push
```

### Ejecutar el Script
1. Abre tu proyecto en el panel web de Google Apps Script ejecutando:
   ```bash
   clasp open
   ```
2. En la barra superior, selecciona la función principal **`ejecutarETL`**.
3. Presiona el botón **Ejecutar** (Run).
4. Revisa la consola del editor web para verificar los logs del proceso (`Logger.log`).

---

## 📁 Estructura del Proyecto

A continuación se muestra el árbol de directorios de este repositorio y la descripción de sus archivos clave:

```
ETL-Basico/
├── .clasp.json          # Archivo de enlace local-nube que contiene el Script ID de Google Apps Script.
├── appsscript.json      # Manifiesto del proyecto (zona horaria, permisos y versión de runtime V8).
└── Código.js            # Archivo de código fuente principal con las fases ETL del pipeline.
```

---

## 🤝 Contribución y Licencia

### Contribución
¡Las contribuciones son bienvenidas! Si deseas proponer mejoras al pipeline, optimizar el uso de memoria o agregar validaciones de datos:
1. Haz un Fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-mejora`).
3. Confirma tus cambios (`git commit -m 'Añade nueva validación'`).
4. Haz un Push a tu rama (`git push origin feature/nueva-mejora`).
5. Abre un Pull Request describiendo tu propuesta.

### Licencia
Este proyecto se encuentra bajo la Licencia **MIT**. Consulta el archivo `LICENSE` en la raíz del repositorio para más información.

---

> _"Siempre muéstrame el código actualizado y completo, indicándome los cambios realizados y/o modificados respecto a la versión anterior."_
