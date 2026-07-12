const video = document.getElementById('webcam');
const predictionBox = document.getElementById('prediction-box');
const statusText = document.getElementById('status');
const canvasOculto = document.getElementById('canvas_oculto'); 

// Elementos de la nueva interfaz interactiva
const loadingScreen = document.getElementById('loading-screen');
const mainApp = document.getElementById('main-app');
const startAppBtn = document.getElementById('start-app-btn');
const targetNumberTxt = document.getElementById('target-number');
const feedbackBadge = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const guideImg = document.getElementById('guide-img');
const imagePlaceholder = document.getElementById('image-placeholder');

let model;
let handDetector;
let isPredictingLive = false;
let currentTargetNumber = 0;
let successFrameCount = 0; // Para exigir que mantenga la seña un momento

// Ruta a tus imágenes de guía (Crea una carpeta llamada 'img' y pon señas del 0 al 9)
// Ej: img/asl_0.png, img/asl_1.png, etc.
// Cambia esto en tu app.js si tus imágenes terminan en .jpg
const GUIAS_IMAGENES = {
    0: 'img/asl_0.jpg', 1: 'img/asl_1.jpg', 2: 'img/asl_2.jpg',
    3: 'img/asl_3.jpg', 4: 'img/asl_4.jpg', 5: 'img/asl_5.jpg',
    6: 'img/asl_6.jpg', 7: 'img/asl_7.jpg', 8: 'img/asl_8.jpg', 9: 'img/asl_9.jpg'
};

// 1. Cargar secuencialmente los modelos en segundo plano
async function loadModel() {
    try {
        statusText.innerText = "Inicializando entorno gráfico (WebGL)...";
        await tf.setBackend('webgl');
        await tf.ready();

        statusText.innerText = "Cargando detector de manos (MediaPipe)...";
        const handModel = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = { runtime: 'tfjs', modelType: 'lite', maxHands: 1 };
        handDetector = await handPoseDetection.createDetector(handModel, detectorConfig);

        statusText.innerText = "Cargando clasificador de señas (CNN)...";
        model = await tf.loadGraphModel('./modelo_tfjs/model.json');

        // Todo listo: Cambiar estado y activar el botón de entrada
        statusText.innerText = "Sistemas listos para producción.";
        startAppBtn.disabled = false;
    } catch (error) {
        console.error("Error crítico en la inicialización:", error);
        statusText.innerText = "Error cargando modelos. Revisa la consola.";
    }
}

// 2. Flujo de inicio al presionar el botón "Probar Aplicación"
async function iniciarFlujoAplicacion() {
    loadingScreen.classList.add('hidden'); // Ocultar pantalla de carga
    mainApp.classList.remove('hidden');    // Mostrar interfaz de juego
    
    generarNuevoObjetivo(); // Elegir primer número aleatorio
    await setupWebcam();    // Encender la cámara web
}

// 3. Configurar y encender cámara web
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
            isPredictingLive = true;
            ejecutarPrediccionEnVivo();
        });
    } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        alert("No se pudo acceder a la cámara.");
    }
}

// 4. Lógica del juego: Generar número aleatorio del 0 al 9 y actualizar imagen guía
function generarNuevoObjetivo() {
    successFrameCount = 0;
    feedbackBadge.innerText = "Buscando mano...";
    feedbackBadge.classList.remove('correct');
    
    // Elegir número aleatorio
    currentTargetNumber = Math.floor(Math.random() * 10);
    targetNumberTxt.innerText = currentTargetNumber;
    
    // Cambiar imagen de referencia
    if (GUIAS_IMAGENES[currentTargetNumber]) {
        guideImg.src = GUIAS_IMAGENES[currentTargetNumber];
        guideImg.style.display = 'block';
        imagePlaceholder.style.display = 'none';
    } else {
        guideImg.style.display = 'none';
        imagePlaceholder.style.display = 'block';
        imagePlaceholder.innerText = `[Muestra el número ${currentTargetNumber}]`;
    }
}

// 5. Controlador continuo del bucle de video
async function ejecutarPrediccionEnVivo() {
    if (!isPredictingLive) return;
    try {
        await predict();
    } catch (e) {
        console.error("Error en ciclo de predicción:", e);
    }
    requestAnimationFrame(ejecutarPrediccionEnVivo);
}

// 6. Procesamiento con OpenCV y validación interactiva
async function predict() {
    if (!model || !handDetector || video.readyState < 2) return; 

    let src = null, cropped = null, gray = null, resized = null;
    
    try {
        src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);
        cap.read(src);

        const hands = await handDetector.estimateHands(video);
        let rectX, rectY, rectSize;

        if (hands && hands.length > 0) {
            const keypoints = hands[0].keypoints;
            let xMin = video.width, yMin = video.height, xMax = 0, yMax = 0;
            
            keypoints.forEach(kp => {
                if (kp.x < xMin) xMin = kp.x;
                if (kp.y < yMin) yMin = kp.y;
                if (kp.x > xMax) xMax = kp.x;
                if (kp.y > yMax) yMax = kp.y;
            });

            let width = xMax - xMin;
            let height = yMax - yMin;
            rectSize = Math.max(width, height) * 1.6; 
            
            let centerX = xMin + width / 2;
            let centerY = yMin + height / 2;
            rectX = centerX - rectSize / 2;
            rectY = centerY - rectSize / 2;

            if (rectX < 0) rectX = 0;
            if (rectY < 0) rectY = 0;
            if (rectX + rectSize > video.width) rectSize = video.width - rectX;
            if (rectY + rectSize > video.height) rectSize = video.height - rectY;
        } else {
            // Recorte central si no se detecta mano
            rectSize = Math.min(video.width, video.height); 
            rectX = (video.width - rectSize) / 2; 
            rectY = (video.height - rectSize) / 2; 
        }
        
        let rect = new cv.Rect(Math.floor(rectX), Math.floor(rectY), Math.floor(rectSize), Math.floor(rectSize));
        cropped = src.roi(rect); 

        // Procesamiento en escala de grises y ecualización (manteniendo el fondo original)
        gray = new cv.Mat();
        cv.cvtColor(cropped, gray, cv.COLOR_RGBA2GRAY); 
        cv.equalizeHist(gray, gray); 

        resized = new cv.Mat();
        cv.resize(gray, resized, new cv.Size(64, 64), 0, 0, cv.INTER_AREA);
        cv.imshow(canvasOculto, resized);

        // Inferencia neuronal
        tf.tidy(() => {
            const tfImg = tf.browser.fromPixels(canvasOculto, 1);
            const floatImg = tf.cast(tfImg, 'float32');
            const normalized = tf.div(floatImg, 255.0); 
            const batched = tf.expandDims(normalized, 0); 
            
            const prediction = model.predict(batched);
            const classIdTensor = tf.argMax(prediction, 1);
            const classId = classIdTensor.dataSync()[0];
            
            predictionBox.innerText = `Predicción: ${classId}`;

            // --- LÓGICA DE APRENDIZAJE / VALIDACIÓN INTERACTIVA ---
            if (hands && hands.length > 0) {
                if (classId === currentTargetNumber) {
                    successFrameCount++;
                    feedbackBadge.innerText = `¡Correcto! Mantén la seña... (${successFrameCount}/15)`;
                    feedbackBadge.classList.add('correct');

                    // Si sostiene la postura por 15 fotogramas continuos, avanza de número
                    if (successFrameCount >= 15) {
                        generarNuevoObjetivo();
                    }
                } else {
                    successFrameCount = 0;
                    feedbackBadge.innerText = "¡Inténtalo otra vez!";
                    feedbackBadge.classList.remove('correct');
                }
            } else {
                successFrameCount = 0;
                feedbackBadge.innerText = "Coloca tu mano frente a la cámara.";
                feedbackBadge.classList.remove('correct');
            }
        });

    } catch (error) {
        console.error("Error en procesamiento:", error);
    } finally {
        if (src) src.delete();
        if (cropped) cropped.delete();
        if (gray) gray.delete();
        if (resized) resized.delete();
    }
}

// Vinculación de Eventos
startAppBtn.addEventListener('click', iniciarFlujoAplicacion);
nextBtn.addEventListener('click', generarNuevoObjetivo);
window.onload = loadModel;