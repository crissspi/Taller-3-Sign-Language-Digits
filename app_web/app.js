// app.js

const video = document.getElementById('webcam');
const startBtn = document.getElementById('start-btn');
const predictBtn = document.getElementById('predict-btn');
const predictionBox = document.getElementById('prediction-box');
const statusText = document.getElementById('status');

let model;

// 1. Cargar el modelo real de TensorFlow.js
async function loadModel() {
    try {
        statusText.innerText = "Cargando modelo...";
        // Ruta corregida a la carpeta que generaste
        model = await tf.loadLayersModel('./modelo_tfjs/model.json');
        
        statusText.innerText = "Modelo cargado. Listo para usar.";
        startBtn.disabled = false;
    } catch (error) {
        console.error("Error al cargar el modelo:", error);
        statusText.innerText = "Error cargando el modelo. Revisa la consola.";
    }
}

// 2. Iniciar la cámara web
async function setupWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240 },
            audio: false
        });
        video.srcObject = stream;
        
        video.addEventListener('loadeddata', () => {
            predictBtn.disabled = false;
            statusText.innerText = "Cámara activa.";
        });
    } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        statusText.innerText = "Error accediendo a la cámara.";
    }
}

// 3. Realizar la predicción
async function predict() {
    // Validar que el modelo esté cargado
    if (!model) return; 
    
    // a) Capturar el frame actual del video y convertirlo en un tensor
    const tfImg = tf.browser.fromPixels(video);
    
    // b) Preprocesamiento exacto para tu modelo (64x64 en escala de grises)
    const resized = tf.image.resizeBilinear(tfImg, [64, 64]);
    const gray = tf.image.rgbToGrayscale(resized); // Convertir a 1 canal (blanco y negro)
    const normalized = gray.div(255.0); // Normalizar entre 0 y 1
    const batched = normalized.expandDims(0); // Agregar dimensión de batch: [1, 64, 64, 1]
    
    // c) Ejecutar predicción real
    const prediction = model.predict(batched);
    const classId = prediction.argMax(1).dataSync()[0]; // Obtener el índice con mayor probabilidad
    
    // Limpiar memoria de tensores (¡Muy importante en JS para que no se congele el navegador!)
    tfImg.dispose();
    resized.dispose();
    gray.dispose();
    normalized.dispose();
    batched.dispose();
    prediction.dispose();
    
    // d) Mostrar resultado real
    predictionBox.innerText = `Predicción: ${classId}`;
}

// Event Listeners
startBtn.addEventListener('click', setupWebcam);
predictBtn.addEventListener('click', () => {
    predict(); 
});

// Inicializar la app
window.onload = loadModel;