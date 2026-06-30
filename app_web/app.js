// app.js

const video = document.getElementById('webcam');
const startBtn = document.getElementById('start-btn');
const predictBtn = document.getElementById('predict-btn');
const predictionBox = document.getElementById('prediction-box');
const statusText = document.getElementById('status');

let model;

// 1. Cargar el modelo de TensorFlow.js
// IMPORTANTE: Primero deben exportar el modelo desde Python (Keras) a tfjs.
// Usar: tensorflowjs_converter --input_format keras modelo.keras ./tfjs_model
async function loadModel() {
    try {
        statusText.innerText = "Cargando modelo...";
        // Descomentar esta línea cuando tengan la carpeta del modelo generada:
        // model = await tf.loadLayersModel('./tfjs_model/model.json');
        
        // Simulando que cargó para fines de la interfaz base:
        setTimeout(() => {
            statusText.innerText = "Modelo cargado (Simulación). Listo para usar.";
            startBtn.disabled = false;
        }, 1000);
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
    // if (!model) return; // Descomentar cuando el modelo real esté listo
    
    // a) Capturar el frame actual del video y convertirlo en un tensor
    const tfImg = tf.browser.fromPixels(video);
    
    // b) Preprocesamiento (Ajustar según lo que hayan hecho en el Notebook)
    // - Redimensionar a 64x64 (o el tamaño que hayan usado)
    // - Convertir a escala de grises (si lo entrenaron así) o mantener RGB.
    // - Normalizar (dividir por 255.0)
    // - Expandir dimensiones (agregar la dimensión del batch: [1, 64, 64, 3])
    
    // Ejemplo (Ajustar según necesidad de su red neuronal):
    const resized = tf.image.resizeBilinear(tfImg, [64, 64]);
    const normalized = resized.div(255.0);
    const batched = normalized.expandDims(0);
    
    // c) Predecir
    // const prediction = model.predict(batched);
    // const classId = prediction.argMax(1).dataSync()[0];
    
    // Limpiar memoria
    tfImg.dispose();
    resized.dispose();
    normalized.dispose();
    batched.dispose();
    
    // d) Mostrar resultado (simulado)
    const simulatedPrediction = Math.floor(Math.random() * 10); // Simulación del 0 al 9
    predictionBox.innerText = `Predicción: ${simulatedPrediction} (Simulado)`;
}

// Event Listeners
startBtn.addEventListener('click', setupWebcam);
predictBtn.addEventListener('click', () => {
    // En lugar de una sola predicción, también podrían hacer un bucle continuo usando requestAnimationFrame
    predict(); 
});

// Inicializar la app
window.onload = loadModel;
