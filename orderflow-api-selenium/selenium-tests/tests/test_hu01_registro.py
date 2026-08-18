import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pages.registro_page import RegistroPage


def test_registro_exitoso(driver, base_url, datos_usuario):
    """HU01: un visitante nuevo puede registrarse con datos validos."""
    pagina = RegistroPage(driver, base_url)
    pagina.registrar(
        datos_usuario["nombre"],
        datos_usuario["correo"],
        datos_usuario["password"],
    )

    mensaje = pagina.obtener_mensaje_exito()
    assert mensaje.is_displayed()
    assert "creada" in mensaje.text.lower()


def test_registro_correo_duplicado(driver, base_url, datos_usuario):
    """HU01: no se permite registrar dos veces el mismo correo."""
    pagina = RegistroPage(driver, base_url)
    pagina.registrar(
        datos_usuario["nombre"],
        datos_usuario["correo"],
        datos_usuario["password"],
    )

    mensaje = pagina.obtener_mensaje_error()
    assert mensaje.is_displayed()
    assert "registrado" in mensaje.text.lower()
