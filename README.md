# Taller 3 A: Sign Language Digits (CNN)

Proyecto que implementa un clasificador de lenguaje de señas (dígitos del 0 al 9) mediante Redes Neuronales Convolucionales (CNN), en cumplimiento con los requerimientos del Taller 3 de Inteligencia Artificial.

## Requisitos Previos e Instalación

Para la correcta ejecución de los notebooks y scripts de este proyecto, se requiere configurar un entorno virtual e instalar las dependencias necesarias.

1. **Crear y activar un entorno virtual**:
   * En Windows: `python -m venv venv` y luego `venv\Scripts\activate`
   * En Linux/Mac: `python3 -m venv venv` y luego `source venv/bin/activate`
2. **Instalar dependencias**:
   Ejecute el siguiente comando para instalar las librerías requeridas indicadas en la raíz del proyecto:
   `pip install -r requirements.txt`

## Entregables y Estructura

El proyecto contiene todos los elementos solicitados en la evaluación:

1.  **Notebooks (`notebooks/`)**:
    *   `01_EDA_y_Procesamiento.ipynb`: Realiza la descarga automática de los datasets desde Google Drive. Contiene la definición del objetivo, análisis exploratorio, procesamiento, aumento de datos y división de subconjuntos (entrenamiento, validación y prueba).
    *   `02_Entrenamiento_y_Evaluacion.ipynb`: Detalla la creación de la arquitectura del modelo, su entrenamiento y la evaluación de resultados.
2.  **Datasets (`dataset/`)**: Directorio destinado a almacenar los datos. Los datos originales y preprocesados son descargados y generados automáticamente al ejecutar el primer notebook. El corpus final (18.026 imágenes) está compuesto por la integración de 4 fuentes distintas:
    *   *Sign Language Digits Dataset* (Arda Mavi)
    *   *Digits from 0 to 9 in American Sign Language* (schauerstoff)
    *   *Sign Language Digits* (abdulrahmanelbanna)
    *   *American Sign Language Digit Dataset* (rayeed045)
3.  **Modelo Final (`modelo_final/`)**: El modelo entrenado y exportado se encuentra aquí en formato `.keras`, junto con el script de predicción para uso local.
4.  **Aplicación Web (`app_web/`)**: Aplicación para realizar predicciones en lenguaje de señas en tiempo real mediante la cámara web.

## Ejecución del Proyecto

### 1. Preparación y Generación del Modelo
1. Ejecute completamente el notebook `01_EDA_y_Procesamiento.ipynb`. Este se encargará de forma automática de descargar el dataset crudo y generar los datos procesados listos para la red.
2. Ejecute el notebook `02_Entrenamiento_y_Evaluacion.ipynb` para compilar, entrenar y exportar el modelo final.

### 2. Uso de la Aplicación por Consola (Local)
Puede realizar pruebas del modelo de forma local mediante la terminal:
* Ingrese al directorio `modelo_final/` y ejecute el script `prediccion_local.py` teniendo el entorno virtual activo.

### 3. Uso de la Aplicación Web
1. Inicie un servidor web local en el directorio raíz o en `app_web/` (por ejemplo, ejecutando `python -m http.server`).
2. Abra el archivo `index.html` en su navegador.
3. Otorgue los permisos de cámara solicitados para que el sistema comience a predecir.

