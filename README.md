# Clasificación de Dígitos en Lenguaje de Señas - Taller 3

Este proyecto tiene como objetivo desarrollar un modelo de aprendizaje profundo para clasificar dígitos (del 0 al 9) representados en lenguaje de señas.

---

## 📊 Dataset

El proyecto utiliza una versión ya procesada del **Sign Language Digits Dataset** (https://www.kaggle.com/datasets/ardamavi/sign-language-digits-dataset). Los archivos correspondientes se encuentran en la carpeta `dataset/Sign-language-digits-dataset/`:

*   **`X.npy`**: Contiene las imágenes preprocesadas (arreglos de NumPy).
*   **`Y.npy`**: Contiene las etiquetas correspondientes (one-hot encoding).

---

## 🛠️ Requisitos e Instalación

Para asegurar la reproducibilidad del proyecto, se recomienda utilizar un entorno virtual de Python. Sigue los pasos a continuación para configurar tu entorno y realizar las instalaciones correspondientes:

### 1. Clonar el repositorio
Clona el proyecto en tu máquina local:
```bash
git clone https://github.com/crissspi/Taller-3-Sign-Language-Digits.git
cd Taller-3-Sign-Language-Digits
```

### 2. Crear un entorno virtual
Crea un entorno virtual de Python (por ejemplo, llamado `venv`):

*   **En Windows (PowerShell/CMD):**
    ```bash
    python -m venv venv
    ```
*   **En macOS/Linux:**
    ```bash
    python3 -m venv venv
    ```

### 3. Activar el entorno virtual
Activa el entorno virtual antes de instalar las dependencias:

*   **En Windows (PowerShell):**
    ```powershell
    .\venv\Scripts\Activate.ps1
    ```
*   **En Windows (CMD):**
    ```cmd
    .\venv\Scripts\activate.bat
    ```
*   **En macOS/Linux (Bash/Zsh):**
    ```bash
    source venv/bin/activate
    ```

### 4. Instalar las dependencias
Una vez activado el entorno virtual, instala todos los paquetes requeridos listados en `requirements.txt`:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Las dependencias principales instaladas son:
*   `tensorflow` y `keras` (para el modelo de Deep Learning)
*   `opencv-python` (para el procesamiento de imágenes)
*   `matplotlib` y `seaborn` (para visualización de datos y métricas)
*   `scikit-learn` (para la división del dataset y evaluación)
*   `tensorboard` (para monitorear el entrenamiento)

---

## 📁 Estructura del Proyecto

```text
├── app_web/              # Aplicación web para probar el modelo
│   ├── index.html
│   └── app.js
├── dataset/              # Carpeta que almacena los datos
│   └── Sign-language-digits-dataset/
│       ├── X.npy         # Características (imágenes preprocesadas)
│       └── Y.npy         # Etiquetas correspondientes
├── notebooks/            # Notebooks de Jupyter
│   ├── 01_EDA_y_Procesamiento.ipynb
│   └── 02_Entrenamiento_y_Evaluacion.ipynb
├── requirements.txt      # Archivo con dependencias de Python
└── README.md             # Instrucciones del proyecto
```

---

## 📓 Notebooks Disponibles

1.  **`notebooks/01_EDA_y_Procesamiento.ipynb`**: Análisis exploratorio de los datos y preprocesamiento de las imágenes.
2.  **`notebooks/02_Entrenamiento_y_Evaluacion.ipynb`**: Entrenamiento de la red neuronal convolucional (CNN) y evaluación del modelo.
