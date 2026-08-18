import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pages.login_page import LoginPage


def test_login_credenciales_invalidas(driver, base_url, datos_usuario):
    """HU02: con contrasena incorrecta se muestra un error y no se accede al panel."""
    pagina = LoginPage(driver, base_url)
    pagina.login(datos_usuario["correo"], "clave_incorrecta")

    mensaje = pagina.obtener_mensaje_error()
    assert mensaje.is_displayed()
    assert "credenciales" in mensaje.text.lower()
    assert "/login.html" in driver.current_url


def test_login_exitoso(driver, base_url, datos_usuario):
    """HU02: con credenciales correctas el usuario entra al dashboard."""
    pagina = LoginPage(driver, base_url)
    pagina.login(datos_usuario["correo"], datos_usuario["password"])

    pagina.esperar_dashboard()
    assert "dashboard.html" in driver.current_url
