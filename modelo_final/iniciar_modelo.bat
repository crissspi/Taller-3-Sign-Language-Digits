@echo off
title Clasificador de Lenguaje de Senas

echo ===================================================
echo   Verificando e instalando librerias necesarias...
echo ===================================================
pip install opencv-python tensorflow numpy

echo.
echo ===================================================
echo   Iniciando la Inteligencia Artificial...
echo ===================================================
python prediccion_local.py

echo.
echo El programa ha terminado o ha ocurrido un error.
pause