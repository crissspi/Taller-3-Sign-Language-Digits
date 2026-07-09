import cv2
import numpy as np
from tensorflow.keras.models import load_model

print("Cargando el modelo... (esto puede tomar unos segundos)")
# Carga el modelo directamente desde tu carpeta
# Asegúrate de que la ruta coincida con donde guardaste el .keras
modelo = load_model('./modelo_cnn_sign_language.keras')
print("¡Modelo cargado!")

# Iniciar la cámara web (el 0 suele ser la cámara por defecto)
# Si no te abre con 0, a veces hay que probar con 1 o usar cv2.CAP_DSHOW
cap = cv2.VideoCapture(cv2.CAP_DSHOW + 0)  # Usar CAP_DSHOW para evitar problemas en Windows

if not cap.isOpened():
    print("Error: No se pudo acceder a la cámara.")
    exit()

print("Cámara iniciada. Presiona la tecla 'q' en la ventana de video para salir.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Espejar la imagen (opcional, suele ser más intuitivo)
    frame = cv2.flip(frame, 1)

    # 1. Definir un área de recorte (ROI - Region of Interest)
    # Dibujamos un cuadrado verde en la pantalla de 240x240 píxeles
    cv2.rectangle(frame, (200, 100), (440, 340), (0, 255, 0), 2)
    
    # Recortar solo lo que está dentro del cuadrado
    recorte = frame[100:340, 200:440]

    # 2. Preprocesamiento idéntico al de tu entrenamiento
    gris = cv2.cvtColor(recorte, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gris, (64, 64))
    
    # Normalizar y darle la forma de tensor: [1, 64, 64, 1]
    normalizado = resized / 255.0
    batched = np.expand_dims(normalizado, axis=(0, -1))

    # 3. Predicción
    prediccion = modelo.predict(batched, verbose=0)
    clase = np.argmax(prediccion)

    # 4. Mostrar el resultado en la ventana
    texto = f'Prediccion: {clase}'
    cv2.putText(frame, texto, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 3)
    
    # Mostrar el recuadro que ve el modelo en una ventanita aparte (opcional, para depurar)
    cv2.imshow('Ojo del Modelo (64x64)', resized)
    
    # Mostrar la cámara principal
    cv2.imshow('Reconocimiento en Vivo', frame)

    # Salir del bucle si se presiona la tecla 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Liberar recursos
cap.release()
cv2.destroyAllWindows()