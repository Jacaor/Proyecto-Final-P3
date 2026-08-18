def test_listar_productos_carga_tabla(dashboard_autenticado):
    """HU04: la tabla de productos se llena con los productos activos de la API."""
    dashboard_autenticado.crear_producto("Producto Base HU04", 15.99, 20)

    fila = dashboard_autenticado.esperar_fila_producto("Producto Base HU04")
    assert fila is not None
    assert "15.99" in fila.text
