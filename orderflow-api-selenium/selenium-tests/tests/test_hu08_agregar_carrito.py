def test_agregar_producto_al_carrito(dashboard_autenticado):
    """HU08: agregar un producto al carrito lo muestra en la tabla con su subtotal."""
    nombre_producto = "Producto Carrito HU08"
    dashboard_autenticado.crear_producto(nombre_producto, 10.00, 8)

    dashboard_autenticado.agregar_producto_al_carrito(nombre_producto)

    filas_carrito = dashboard_autenticado.filas_carrito()
    assert len(filas_carrito) == 1
    assert nombre_producto in filas_carrito[0].text
    assert "10.00" in dashboard_autenticado.obtener_total_carrito()
