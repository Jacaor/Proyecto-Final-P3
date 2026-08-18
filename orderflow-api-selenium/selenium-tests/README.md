# Pruebas Selenium - OrderFlow API

Suite de pruebas automatizadas con Selenium + pytest para el frontend
(HTML/CSS/JS) que se agrego al proyecto `orderflow-api`, basada en 12
historias de usuario (ver `historias_usuario.md`).

## Requisitos

- Google Chrome instalado en la maquina.
- Python 3.10 o superior.
- El servidor de `orderflow-api` corriendo (incluye el frontend).

## 1. Levantar el sistema a probar

```bash
cd orderflow-api
npm install
cp .env.example .env
npm start
```

El sistema queda disponible en `http://localhost:3000` (login en
`http://localhost:3000/login.html`).

## 2. Instalar dependencias de las pruebas

```bash
cd selenium-tests
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux / Mac
pip install -r requirements.txt
```

Selenium 4.6+ descarga automaticamente el chromedriver correcto para tu
version de Chrome (Selenium Manager), no hace falta instalarlo aparte.

## 3. Ejecutar las pruebas

```bash
pytest
```

Esto corre las 12 historias de usuario en orden (HU01 a HU12), genera:

- **`screenshots/`**: una captura de pantalla por cada prueba ejecutada
  (pase o falle), con el estado y el nombre de la prueba en el archivo.
- **`reportes/reporte.html`**: reporte HTML autocontenido con el
  resultado de toda la corrida.

Para ver el navegador mientras corre (sin headless):

```bash
pytest --ver-navegador
```

Si el sistema no corre en `localhost:3000`, se puede indicar otra URL:

```bash
ORDERFLOW_URL=http://localhost:4000 pytest
```

## Estructura

```
selenium-tests/
  conftest.py              fixtures: driver, usuario de prueba, capturas
  pytest.ini                configuracion de pytest y del reporte html
  historias_usuario.md      historias de usuario y su trazabilidad
  pages/                    Page Object Model (login, registro, dashboard)
  tests/                    un archivo de prueba por historia de usuario
  screenshots/              capturas generadas al correr las pruebas
  reportes/                 reporte.html generado al correr las pruebas
```
