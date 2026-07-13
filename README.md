# Taller 3 A: Sign Language Digits (CNN)

Proyecto que implementa un clasificador de lenguaje de señas (dígitos del 0 al 9) mediante Redes Neuronales Convolucionales (CNN), en cumplimiento con los requerimientos del Taller 3 de Inteligencia Artificial.

## Estructura del Proyecto

```text
├── app_web/                       # Interfaz Front-End (HTML5, CSS3, JS)
│   ├── modelo_tfjs/                # Directorio de despliegue para las capas web
│   │   ├── model.json              # Topología de la red traducida
│   │   └── group1-shard1of1.bin    # Pesos sinápticos binarios
│   ├── app.js                      # Pipeline de inferencia asíncrona in-browser
│   └── index.html                  # Interfaz de usuario para la cámara web
├── dataset/                        # Repositorio de datos
│   └── datos_procesados/           # Tensores unificados (.npy) generados en la Fase 1
├── modelo_final/                   # Artefactos del modelo entrenado y pruebas
│   ├── modelo_universal/            # Grafo matemático puro (SavedModel)
│   │   ├── assets/
│   │   ├── variables/
│   │   └── saved_model.pb          # Binario universal libre de dependencias
│   └── prediccion_local.py         # Script de inferencia nativa local con OpenCV
├── notebooks/                      # Jupyter Notebooks de desarrollo y experimentación
│   ├── 01_EDA_y_Procesamiento.ipynb
│   └── 02_Entrenamiento_y_Evaluacion.ipynb
└── requirements.txt                 # Manifiesto de dependencias del entorno virtual
```

## Requisitos Previos e Instalación

Para la correcta ejecución de los notebooks y scripts de este proyecto, se requiere configurar un entorno virtual e instalar las dependencias necesarias.

1. **Crear y activar un entorno virtual**:
   - En Windows: `python -m venv venv` y luego `venv\Scripts\activate`
   - En Linux/Mac: `python3 -m venv venv` y luego `source venv/bin/activate`
2. **Instalar dependencias**:
   Ejecute el siguiente comando para instalar las librerías requeridas indicadas en la raíz del proyecto:
   ```bash
   pip install -r requirements.txt
   ```

## Entregables y Estructura

El proyecto contiene todos los elementos solicitados en la evaluación:

1. **Notebooks (`notebooks/`)**:
   - `01_EDA_y_Procesamiento.ipynb`: Realiza la descarga automática de los datasets desde Google Drive. Contiene la definición del objetivo, análisis exploratorio, procesamiento, aumento de datos y división de subconjuntos (entrenamiento, validación y prueba).
   - `02_Entrenamiento_y_Evaluacion.ipynb`: Detalla la creación de la arquitectura del modelo, su entrenamiento y la evaluación de resultados.
2. **Datasets (`dataset/`)**: Directorio destinado a almacenar los datos. Los datos originales y preprocesados son descargados y generados automáticamente al ejecutar el primer notebook. El corpus final (18.026 imágenes) está compuesto por la integración de 4 fuentes distintas:
   - *Sign Language Digits Dataset* (Arda Mavi)
   - *Digits from 0 to 9 in American Sign Language* (schauerstoff)
   - *Sign Language Digits* (abdulrahmanelbanna)
   - *American Sign Language Digit Dataset* (rayeed045)
3. **Modelo Final (`modelo_final/`)**: El modelo entrenado y exportado se encuentra aquí, junto con el script de predicción para uso local.
4. **Aplicación Web (`app_web/`)**: Aplicación para realizar predicciones en lenguaje de señas en tiempo real mediante la cámara web.

### Fase de Preparación y Entrenamiento

- Ejecute completamente el notebook `notebooks/01_EDA_y_Procesamiento.ipynb` para descargar, limpiar y particionar automáticamente el dataset consolidado (70% Train, 15% Validación, 15% Test).
- Ejecute el notebook `notebooks/02_Entrenamiento_y_Evaluacion.ipynb`. Este bloque compila la red convolucional utilizando regularización L2 (0.001), Dropout (0.5), pesos balanceados dinámicos por clase (`class_weight`) para mitigar el sesgo, y el callback de parada temprana `EarlyStopping` para interceptar de forma óptima el sobreajuste.

### Uso de la Inferencia Local (Consola)

Con el entorno virtual activo, navegue hacia el directorio del modelo final y ejecute el script nativo de visión artificial con OpenCV:

```bash
cd modelo_final
python prediccion_local.py
```

### Uso de la Aplicación Web (Front-End)

Para iniciar la interfaz en el navegador web es indispensable utilizar un servidor HTTP local, con el fin de evitar bloqueos por políticas de seguridad de origen cruzado (CORS).

1. Ingrese a la carpeta web:
   ```bash
   cd app_web
   ```
2. Levante el servidor de Python en un puerto limpio (por ejemplo, el 9000):
   ```bash
   python -m http.server 9000
   ```
3. Abra su navegador e ingrese a la siguiente dirección exacta:
   `http://localhost:9000`

#### Solución de Problemas de Red (Address already in use)

Si el terminal arroja el error `OSError: [Errno 98] Address already in use`, significa que existen procesos previos de Python bloqueando el tráfico de red local.

- **Solución rápida (comodín):** fuerce a Python a buscar un puerto libre asignándole el puerto 0:
  ```bash
  python -m http.server 0
  ```
- **Solución limpia (liberar puertos):** cierre todos los procesos HTTP en segundo plano con el comando:
  ```bash
  pkill -f http.server
  ```
  Una vez ejecutado, podrá iniciar el servidor de manera normal en el puerto 8000 o 9000.