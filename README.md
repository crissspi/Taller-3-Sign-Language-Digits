# Taller 3 A: Sign Language Digits (CNN)

Este repositorio contiene todo el material, código y estructura base para desarrollar un clasificador de lenguaje de señas (dígitos del 0 al 9) utilizando Redes Neuronales Convolucionales (CNN), tal como se solicita en el taller de Inteligencia Artificial.

---

## Estructura del Proyecto: 

El proyecto está dividido en tres grandes módulos:

### 1. `notebooks/` (Procesamiento y Modelo)
Contiene el código en Python (Jupyter Notebooks) donde ocurre la "magia" del Machine Learning.
*   **`01_EDA_y_Procesamiento.ipynb`**: Se encarga de la **Fase 1** (Puntos 1, 2 y 3 del PDF). Aquí se cargan las imágenes (`X.npy` y `Y.npy`), se genera el gráfico de distribución (EDA), se agregan los canales de color, se divide la data (Train/Test) y se configura el *Data Augmentation* para generar distorsiones que mejoren el aprendizaje.
*   **`02_Entrenamiento_y_Evaluacion.ipynb`**: Se encarga de la **Fase 2** (Puntos 4, 5 y 6). Aquí está construida la arquitectura de la red (Capas Conv2D, MaxPooling, Dense), los parámetros de compilación, el código para entrenar con `EarlyStopping`, la evaluación de los resultados y la exportación del modelo para la web.

### 2. `app_web/` (Aplicación Web)
Contiene la interfaz para que el usuario pueda usar la cámara y predecir el número en tiempo real (Punto 7).
*   **`index.html`**: La estructura visual de la página. Contiene el contenedor del video y los botones.
*   **`style.css`**: Todos los colores, márgenes y diseño visual (modo oscuro) para que se vea moderno.
*   **`app.js`**: La lógica detrás de la web. Se encarga de pedir permisos de cámara, capturar el fotograma, pre-procesar la imagen como lo hicimos en Python y pasarla por el modelo de *TensorFlow.js* para obtener la predicción.

### 3. Archivos de Gestión en la Raíz
*   **`dataset/`**: Carpeta donde se deben alojar los archivos crudos (ej. `X.npy` y `Y.npy`) descargados de Github/Kaggle.

---

# Fase 1: Análisis y Preprocesamiento de Datos

Este documento sirve como bitácora para el equipo. La **Fase 1 (Datos)** ya se encuentra implementada y funcional al 100% en el archivo `notebooks/01_EDA_y_Procesamiento.ipynb`.

## ¿Qué se logró en esta fase?

Hemos cubierto con éxito los Puntos 1, 2 y 3 solicitados en la rúbrica del taller:

1. **Definición del Problema:** Se estableció el objetivo de clasificar imágenes de lenguaje de señas (0-9) para una futura aplicación web.
2. **Análisis Exploratorio (EDA):** 
   - Se verificó que las imágenes vienen en dimensiones de `64x64`.
   - Se comprobó mediante un gráfico de barras que el dataset está **balanceado** (aprox. 205 imágenes por dígito), por lo que la red no tendrá sesgos.
3. **Procesamiento de Datos:**
   - **Reshape:** Acondicionamos las imágenes a `(2062, 64, 64, 1)` para añadir el canal de color (escala de grises) que requiere la red convolucional.
   - **Split:** Dividimos el dataset usando un 70% para entrenamiento (`train`), 15% para validación (`val`) y 15% para prueba (`test`).
   - **Data Augmentation:** Configuramos un `ImageDataGenerator` que aplica ligeras rotaciones, zoom y desplazamientos a las imágenes para evitar que el modelo se sobreajuste (overfitting).

## ¿Cómo usar este avance?

Para la **Fase 2 (El Modelo)** pueda trabajar sin problemas, hemos automatizado el puente entre ambos notebooks:

1. Abre y ejecuta todas las celdas de `01_EDA_y_Procesamiento.ipynb`.
2. Al llegar a la última celda, el código exportará automáticamente 6 archivos en la carpeta `dataset/`:
   - `X_train.npy`
   - `X_val.npy`
   - `X_test.npy`
   - `Y_train.npy`
   - `Y_val.npy`
   - `Y_test.npy`