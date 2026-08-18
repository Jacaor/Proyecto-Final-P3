def test_listar_pedidos_muestra_el_pedido_creado(dashboard_autenticado):
    """HU10: el pedido recien creado aparece en la tabla de "Mis pedidos"."""
    nombre_producto = "Producto Historial HU10"
    dashboard_autenticado.crear_producto(nombre_producto, 7.25, 12)
    dashboard_autenticado.agregar_producto_al_carrito(nombre_producto)
    dashboard_autenticado.click_confirmar_pedido()

    filas_pedidos = dashboard_autenticado.esperar_pedido_con_producto(nombre_producto)

    assert len(filas_pedidos) >= 1
    assert any(nombre_producto in fila.text for fila in filas_pedidos)
