def test_no_permite_confirmar_pedido_vacio(dashboard_autenticado):
    """HU11: si el carrito esta vacio, confirmar pedido muestra un error y no lo crea."""
    total_pedidos_antes = len(dashboard_autenticado.filas_pedidos())

    dashboard_autenticado.click_confirmar_pedido()

    mensaje_error = dashboard_autenticado.obtener_mensaje_error_pedido()
    assert mensaje_error.is_displayed()
    assert "agrega al menos un producto" in mensaje_error.text.lower()

    total_pedidos_despues = len(dashboard_autenticado.filas_pedidos())
    assert total_pedidos_antes == total_pedidos_despues
