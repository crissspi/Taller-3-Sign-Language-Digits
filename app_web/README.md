# App Web — Practica Dígitos en Lenguaje de Señas

Aplicación web que usa **OpenCV.js** (preprocesamiento) y **TensorFlow.js** (inferencia) para ejercitarse en el aprendizaje de dígitos en lenguaje de señas con la cámara web. Corresponde al punto 7 del Taller 3.

## Requisitos

1. El modelo convertido a TensorFlow.js debe existir en `app_web/tfjs_model/` (`model.json` + archivos `.bin`). Se genera automáticamente en la última sección del notebook `02_Entrenamiento_y_Evaluacion.ipynb`, o manualmente:

   ```bash
   pip install tensorflowjs
   tensorflowjs_converter --input_format keras modelos/modelo_final.h5 app_web/tfjs_model
   ```

2. Un navegador moderno (Chrome/Edge/Firefox) con cámara web.

## Cómo ejecutarla

Por seguridad, los navegadores no permiten cargar el modelo ni la cámara desde `file://`. Hay que servir la carpeta con un servidor local:

```bash
cd app_web
python -m http.server 8000
```

Luego abrir en el navegador: **http://localhost:8000**

## Cómo usarla

1. **Iniciar Cámara** → acepta los permisos de la cámara.
2. Coloca tu mano dentro del **recuadro verde** (idealmente con fondo claro y uniforme). La app predice en tiempo real (~4 veces por segundo) y muestra las probabilidades de cada dígito, además de la imagen de 64×64 en escala de grises que "ve" la red.
3. **Modo Práctica** → la app te pide un dígito al azar; haz la seña y mantenla ~2 segundos (barra de progreso). Si la CNN te reconoce con confianza ≥ 70%, sumas un acierto y pasa al siguiente dígito.

## Cómo funciona por dentro

1. Se captura el ROI (recuadro central) del video en un canvas, reflejado en espejo para coincidir con lo que ve el usuario.
2. **OpenCV.js** convierte el recorte a escala de grises (`cv.cvtColor`) y lo redimensiona a 64×64 (`cv.resize`), replicando exactamente el preprocesamiento del entrenamiento en Python.
3. Los píxeles se normalizan a [0, 1] y se arma un tensor `(1, 64, 64, 1)`.
4. **TensorFlow.js** ejecuta la CNN (`tf.loadLayersModel`) y entrega las 10 probabilidades (softmax).

> Consejo: el modelo fue entrenado con las fotos de los datasets (fondos relativamente uniformes). Si las predicciones son inestables, prueba con fondo liso, buena iluminación y la mano ocupando la mayor parte del recuadro.
