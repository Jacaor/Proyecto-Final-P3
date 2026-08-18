import os
import time
import uuid

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = os.environ.get("ORDERFLOW_URL", "http://localhost:3000")
DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))
DIRECTORIO_SCREENSHOTS = os.path.join(DIRECTORIO_ACTUAL, "screenshots")
DIRECTORIO_REPORTES = os.path.join(DIRECTORIO_ACTUAL, "reportes")

os.makedirs(DIRECTORIO_SCREENSHOTS, exist_ok=True)
os.makedirs(DIRECTORIO_REPORTES, exist_ok=True)


def pytest_addoption(parser):
    parser.addoption(
        "--ver-navegador",
        action="store_true",
        default=False,
        help="Muestra la ventana de Chrome mientras corren las pruebas (por defecto se ejecuta oculto/headless)",
    )


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def datos_usuario():
    """Usuario unico para toda la corrida de pruebas, evita choques con el correo."""
    sufijo = uuid.uuid4().hex[:8]
    return {
        "nombre": "QA Tester " + sufijo,
        "correo": "qa_" + sufijo + "@orderflow.test",
        "password": "Clave123",
    }


@pytest.fixture
def driver(request):
    opciones = Options()
    if not request.config.getoption("--ver-navegador"):
        opciones.add_argument("--headless=new")
    opciones.add_argument("--window-size=1366,768")
    opciones.add_argument("--no-sandbox")
    opciones.add_argument("--disable-dev-shm-usage")

    navegador = webdriver.Chrome(options=opciones)
    navegador.implicitly_wait(5)
    WebDriverWait(navegador, 10)

    yield navegador

    navegador.quit()


@pytest.fixture
def dashboard_autenticado(driver, base_url, datos_usuario):
    """Inicia sesion via la interfaz y deja al navegador en el dashboard."""
    import sys

    sys.path.append(DIRECTORIO_ACTUAL)
    from pages.login_page import LoginPage
    from pages.dashboard_page import DashboardPage

    login_page = LoginPage(driver, base_url)
    login_page.login(datos_usuario["correo"], datos_usuario["password"])

    return DashboardPage(driver, base_url)


def _nombre_captura(nombre_test):
    marca_de_tiempo = time.strftime("%Y%m%d_%H%M%S")
    return "{}_{}.png".format(nombre_test, marca_de_tiempo)


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Toma una captura de pantalla al finalizar cada prueba (pase o falle)."""
    resultado = yield
    reporte = resultado.get_result()

    if reporte.when == "call":
        navegador = item.funcargs.get("driver")
        if navegador is not None:
            estado = "OK" if reporte.passed else "FALLO"
            ruta = os.path.join(
                DIRECTORIO_SCREENSHOTS,
                _nombre_captura(estado + "_" + item.name),
            )
            try:
                navegador.save_screenshot(ruta)
            except Exception:
                pass
