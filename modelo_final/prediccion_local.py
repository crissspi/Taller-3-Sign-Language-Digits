import cv2
import numpy as np
import pygame
from tensorflow.keras.models import load_model

pygame.mixer.init()

print("Cargando el modelo... (esto puede tomar unos segundos)")
modelo = load_model('./modelo_cnn_sign_language.keras')
print("¡Modelo cargado!")

cap = cv2.VideoCapture(cv2.CAP_DSHOW + 0)

if not cap.isOpened():
    print("Error: No se pudo acceder a la cámara.")
    exit()

numero_marcado = ""
estado = "MARCANDO" 

print("Cámara iniciada. CONTROLES DE LA PRESENTACIÓN:")
print(" - ESPACIO: Registrar el número que estás haciendo con la mano")
print(" - BORRAR (Retroceso): Eliminar el último dígito por si te equivocas")
print(" - ENTER: Iniciar la llamada (Cambia la pantalla y suena)")
print(" - 'r': Colgar la llamada y reiniciar")
print(" - 'q': Salir de todo")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    
    key = cv2.waitKey(1) & 0xFF

    if estado == "MARCANDO":
        cv2.rectangle(frame, (200, 100), (440, 340), (0, 255, 0), 2)
        recorte = frame[100:340, 200:440]
        
        gris = cv2.cvtColor(recorte, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gris, (64, 64))
        normalizado = resized / 255.0
        batched = np.expand_dims(normalizado, axis=(0, -1))

        prediccion = modelo.predict(batched, verbose=0)
        clase = np.argmax(prediccion)

        cv2.putText(frame, f'Detectando: {clase}', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 100, 0), 2)
        
        # Muestra los números acumulados tipo pantalla de celular
        cv2.putText(frame, f'Numero: +56 9 {numero_marcado}', (50, 400), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 3)
        cv2.putText(frame, "Espacio: Digitar | Enter: Llamar", (50, 450), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

        cv2.imshow('Ojo del Modelo (64x64)', resized)

        if key == 32: 
            if len(numero_marcado) < 15: 
                numero_marcado += str(clase)
        elif key == 8: 
            numero_marcado = numero_marcado[:-1]
        elif key == 13: 
            if len(numero_marcado) > 0:
                estado = "LLAMANDO"
                
                try:
                    pygame.mixer.music.load('Turi ip ip vs wenomechainsama.mp3')
                    pygame.mixer.music.play(-1) # -1 hace que suene en bucle continuo
                except Exception as e:
                    print("No se encontró el audio o hubo un error:", e)

    elif estado == "LLAMANDO":

        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (frame.shape[1], frame.shape[0]), (0, 0, 0), -1)
        frame = cv2.addWeighted(overlay, 0.7, frame, 0.3, 0) # 70% negro, 30% cámara

        cv2.putText(frame, "Llamando a...", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 2)
        cv2.putText(frame, "Jhosep Marca", (50, 220), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 4)
        cv2.putText(frame, f'+56 9 {numero_marcado}', (50, 280), cv2.FONT_HERSHEY_SIMPLEX, 1, (200, 200, 200), 2)

        cv2.putText(frame, "Presiona 'r' para colgar", (50, 400), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        
        try:
            cv2.destroyWindow('Ojo del Modelo (64x64)')
        except:
            pass

        if key == ord('r'): 
            estado = "MARCANDO"
            numero_marcado = ""
            pygame.mixer.music.stop() 

    cv2.imshow('Reconocimiento en Vivo', frame)

    if key == ord('q'):
        break

pygame.mixer.quit()
cap.release()
cv2.destroyAllWindows()