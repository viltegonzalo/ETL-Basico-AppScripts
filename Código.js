/**
 * ARCHIVO DE CONFIGURACIÓN
 * Aquí definimos los IDs de los archivos, nombres de las hojas y parámetros del ETL.
 */
const CONFIG = {
  origen: {
    spreadsheetId: '1c4mihOyj9jj_MCNM8sIgjqj3Ba312BMjr2sDGARYVls', // Reemplazar por el ID real
    nombreHoja: 'DatosCrudos',
    filaEncabezados: 1 // Fila donde están los títulos (para saltarlos si es necesario)
  },
  destino: {
    spreadsheetId: '1lCHBE0olNLu0FZH8cFxgnORMSSXZ3E1GbDlGryvR3So', // Reemplazar por el ID real
    nombreHoja: 'DatosProcesados'
  },
  transformacion: {
    // Parámetros de ejemplo para la regla de negocio
    columnaEstadoIndex: 2, // Índice de la columna "Estado" (0 = A, 1 = B, 2 = C...)
    estadoRequerido: 'Privado'
  }
};

/**
 * FUNCIÓN PRINCIPAL ORQUESTADORA
 * Esta es la función que debes ejecutar manualmente o mediante un activador (trigger).
 */
function ejecutarETL() {
  Logger.log("Iniciando proceso ETL...");
  
  try {
    // 1. EXTRACT (Extraer)
    const datosCrudos = extraerDatos_();
    
    if (!datosCrudos || datosCrudos.length === 0) {
      Logger.log("No se encontraron datos en el origen. Proceso cancelado.");
      return;
    }
    
    // 2. TRANSFORM (Transformar)
    const datosTransformados = transformarDatos_(datosCrudos);
    
    if (datosTransformados.length === 0) {
      Logger.log("Ningún dato pasó los filtros de transformación. No hay nada que cargar.");
      return;
    }
    
    // 3. LOAD (Cargar)
    cargarDatos_(datosTransformados);
    
    Logger.log("Proceso ETL completado con éxito.");
    
  } catch (error) {
    Logger.log("ERROR en el proceso ETL: " + error.message);
  }
}

/**
 * 1. EXTRACT: Conecta al archivo de origen y obtiene los datos.
 * @returns {Array<Array>} Matriz 2D con los datos del origen.
 */
function extraerDatos_() {
  Logger.log("-> Extrayendo datos del ID: " + CONFIG.origen.spreadsheetId);
  
  const ssOrigen = SpreadsheetApp.openById(CONFIG.origen.spreadsheetId);
  const hojaOrigen = ssOrigen.getSheetByName(CONFIG.origen.nombreHoja);
  
  if (!hojaOrigen) {
    throw new Error("No se encontró la hoja de origen: " + CONFIG.origen.nombreHoja);
  }
  
  // Obtiene todos los datos en un array bidimensional
  const rangoDatos = hojaOrigen.getDataRange();
  const valores = rangoDatos.getValues();
  
  return valores;
}

/**
 * 2. TRANSFORM: Aplica reglas de negocio, limpieza o filtros.
 * @param {Array<Array>} datos Datos crudos extraídos.
 * @returns {Array<Array>} Datos procesados y listos para cargar.
 */
function transformarDatos_(datos) {
  Logger.log("-> Transformando datos...");
  
  const datosProcesados = [];
  
  // Separamos los encabezados del resto de los datos
  const encabezados = datos[CONFIG.origen.filaEncabezados - 1];
  
  // Agregamos una nueva columna al encabezado como ejemplo (Fecha de proceso)
  const nuevosEncabezados = [...encabezados, "Fecha de Procesamiento"];
  datosProcesados.push(nuevosEncabezados);
  
  // Iteramos sobre las filas de datos (saltando los encabezados)
  for (let i = CONFIG.origen.filaEncabezados; i < datos.length; i++) {
    const fila = datos[i];
    
    // REGLA DE NEGOCIO 1: Filtrar solo los registros que estén "ACTIVO"
    const estadoActual = fila[CONFIG.transformacion.columnaEstadoIndex];
    
    if (estadoActual === CONFIG.transformacion.estadoRequerido) {
      
      // REGLA DE NEGOCIO 2: Agregar un timestamp (fecha/hora actual) al final de la fila
      const filaTransformada = [...fila, new Date()];
      
      // Podrías hacer más cosas: convertir textos a mayúsculas, limpiar espacios, cálculos matemáticos...
      // Ejemplo: filaTransformada[0] = filaTransformada[0].toString().trim().toUpperCase();
      
      datosProcesados.push(filaTransformada);
    }
  }
  
  Logger.log("-> Registros transformados: " + (datosProcesados.length - 1));
  return datosProcesados;
}

/**
 * 3. LOAD: Conecta al archivo destino y escribe los datos.
 * @param {Array<Array>} datos Datos ya transformados.
 */
function cargarDatos_(datos) {
  Logger.log("-> Cargando datos en el ID: " + CONFIG.destino.spreadsheetId);
  
  const ssDestino = SpreadsheetApp.openById(CONFIG.destino.spreadsheetId);
  const hojaDestino = ssDestino.getSheetByName(CONFIG.destino.nombreHoja);
  
  if (!hojaDestino) {
    throw new Error("No se encontró la hoja de destino: " + CONFIG.destino.nombreHoja);
  }
  
  // Limpiamos la hoja de destino antes de cargar los datos nuevos (Opcional, depende de tu lógica)
  hojaDestino.clear();
  
  // Determinamos el rango exacto donde se pegarán los datos
  const numFilas = datos.length;
  const numColumnas = datos[0].length;
  
  const rangoDestino = hojaDestino.getRange(1, 1, numFilas, numColumnas);
  
  // Escribimos todos los datos de golpe (mucho más rápido que celda por celda)
  rangoDestino.setValues(datos);
  
  Logger.log("-> Carga finalizada.");
}