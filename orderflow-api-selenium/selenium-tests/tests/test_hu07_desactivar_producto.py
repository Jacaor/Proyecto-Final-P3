def test_desactivar_producto_lo_quita_de_la_lista(dashboard_autenticado):
    """HU07: al desactivar un producto deja de aparecer en la tabla de productos."""
    nombre_producto = "Producto Desechable HU07"
    dashboard_autenticado.crear_producto(nombre_producto, 9.99, 5)

    assert dashboard_autenticado.esperar_fila_producto(nombre_producto) is not None

    dashboard_autenticado.desactivar_producto(nombre_producto)

    assert dashboard_autenticado.esperar_producto_desaparece(nombre_producto)
    assert dashboard_autenticado.buscar_fila_producto_por_nombre(nombre_producto) is None
