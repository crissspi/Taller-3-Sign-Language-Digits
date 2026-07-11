const video = document.getElementById('webcam');
const startBtn = document.getElementById('start-btn');
const predictBtn = document.getElementById('predict-btn'); 
const predictionBox = document.getElementById('prediction-box');
const statusText = document.getElementById('status');
const canvasOculto = document.getElementById('canvas_oculto'); 

let model;
let isPredictingLive = false;

// 1. Cargar el modelo de TensorFlow.js (Graph Model)
async function loadModel() {
    try {
        statusText.innerText = "Cargando modelo...";
        model = await tf.loadGraphModel('./modelo_tfjs/model.json');
        statusText.innerText = "Modelo cargado. Listo para iniciar cámara.";
        startBtn.disabled = false;
    } catch (error) {
        console.error("Error al cargar el modelo:", error);
        statusText.innerText = "Error cargando el modelo. Revisa la consola.";
    }
}

// 2. Iniciar la cámara web y activar el bucle automático
async function setupWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240 },
            audio: false
        });
        video.srcObject = stream;
        video.width = 320;
        video.height = 240;
        
        video.addEventListener('loadeddata', () => {
            statusText.innerText = "Cámara activa. Prediciendo en vivo...";
            isPredictingLive = true;
            ejecutarPrediccionEnVivo();
        });
    } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        statusText.innerText = "Error accediendo a la cámara.";
    }
}

// 3. Controlador del bucle continuo
async function ejecutarPrediccionEnVivo() {
    if (!isPredictingLive) return;

    await predict();
    requestAnimationFrame(ejecutarPrediccionEnVivo);
}

// 4. Realizar la predicción en vivo (Con recorte cuadrado para no deformar)
async function predict() {
    if (!model) return; 

    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let cropped = new cv.Mat(); // Nueva matriz para el recorte
    let gray = new cv.Mat();
    let resized = new cv.Mat();

    try {
        let cap = new cv.VideoCapture(video);
        cap.read(src);

        // b2) RECORTAR UN CUADRADO CENTRAL EXACTO
        // Calculamos el lado más corto (la altura: 240) para hacer un cuadrado de 240x240
        let size = Math.min(video.width, video.height); 
        // Centramos el recorte en el eje X
        let x = (video.width - size) / 2; 
        let y = (video.height - size) / 2; 
        
        let rect = new cv.Rect(x, y, size, size);
        cropped = src.roi(rect); // Aplicamos el recorte a la imagen original

        // Ahora procesamos solo el cuadrado recortado
        cv.cvtColor(cropped, gray, cv.COLOR_RGBA2GRAY); 
        cv.equalizeHist(gray, gray); // <-- NUEVO: Ecualiza el histograma para máximo contraste
        cv.resize(gray, resized, new cv.Size(64, 64), 0, 0, cv.INTER_AREA);

        cv.imshow(canvasOculto, resized);

        const tfImg = tf.browser.fromPixels(canvasOculto, 1);
        const floatImg = tfImg.cast('float32');
        const normalized = floatImg.div(255.0); 
        const batched = normalized.expandDims(0); 
        
        const prediction = model.predict(batched);
        const classId = prediction.argMax(1).dataSync()[0];
        
        predictionBox.innerText = `Predicción: ${classId}`;
        
        tfImg.dispose();
        floatImg.dispose();
        normalized.dispose();
        batched.dispose();
        prediction.dispose();

    } catch (error) {
        console.error("Error durante la predicción:", error);
    } finally {
        src.delete();
        cropped.delete(); // Limpiamos la nueva variable
        gray.delete();
        resized.delete();
    }
}

startBtn.addEventListener('click', setupWebcam);
predictBtn.addEventListener('click', predict);

window.onload = loadModel;
