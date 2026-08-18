from selenium.webdriver.common.by import By


def test_no_crea_producto_con_campos_vacios(dashboard_autenticado):
    """HU06: el formulario no permite crear un producto sin nombre, precio o stock."""
    driver = dashboard_autenticado.driver
    total_filas_antes = len(dashboard_autenticado.filas_productos())

    driver.find_element(By.ID, "btnCrearProducto").click()

    total_filas_despues = len(dashboard_autenticado.filas_productos())
    assert total_filas_antes == total_filas_despues
