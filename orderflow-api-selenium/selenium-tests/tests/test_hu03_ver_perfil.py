def test_ver_perfil(dashboard_autenticado, datos_usuario):
    """HU03: el panel muestra el nombre y correo del usuario autenticado."""
    texto_perfil = dashboard_autenticado.obtener_texto_perfil()

    assert datos_usuario["nombre"] in texto_perfil
    assert datos_usuario["correo"] in texto_perfil
