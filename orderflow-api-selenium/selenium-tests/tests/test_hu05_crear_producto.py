def test_crear_producto_aparece_en_tabla(dashboard_autenticado):
    """HU05: un producto nuevo creado desde el formulario aparece en la tabla."""
    nombre_producto = "Camisa Selenium"
    dashboard_autenticado.crear_producto(nombre_producto, 29.90, 15)

    fila = dashboard_autenticado.esperar_fila_producto(nombre_producto)
    assert fila is not None
    assert "29.90" in fila.text or "29.9" in fila.text
    assert "15" in fila.text
