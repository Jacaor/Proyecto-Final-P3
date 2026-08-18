def test_crear_pedido_con_productos_del_carrito(dashboard_autenticado):
    """HU09: confirmar el pedido con productos en el carrito genera un pedido nuevo."""
    nombre_producto = "Producto Pedido HU09"
    dashboard_autenticado.crear_producto(nombre_producto, 12.50, 10)
    dashboard_autenticado.agregar_producto_al_carrito(nombre_producto)

    dashboard_autenticado.click_confirmar_pedido()

    mensaje_exito = dashboard_autenticado.obtener_mensaje_exito_pedido()
    assert mensaje_exito.is_displayed()
    assert "pedido creado" in mensaje_exito.text.lower()
