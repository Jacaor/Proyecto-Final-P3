from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException


class DashboardPage:
    URL_PATH = "/dashboard.html"

    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def abrir(self):
        self.driver.get(self.base_url + self.URL_PATH)

    def obtener_texto_perfil(self):
        return self.driver.find_element(By.ID, "perfilInfo").text

    def crear_producto(self, nombre, precio, stock):
        self.driver.find_element(By.ID, "nombreProducto").send_keys(nombre)
        self.driver.find_element(By.ID, "precioProducto").send_keys(str(precio))
        self.driver.find_element(By.ID, "stockProducto").send_keys(str(stock))
        self.driver.find_element(By.ID, "btnCrearProducto").click()

    def filas_productos(self):
        return self.driver.find_elements(By.CSS_SELECTOR, "#cuerpoProductos tr")

    def esperar_fila_producto(self, nombre, timeout=10):
        """Espera a que el producto aparezca en la tabla tras el fetch.

        Tolera StaleElementReferenceException: si la tabla se esta
        redibujando justo cuando leemos una fila, simplemente se
        considera que "todavia no esta lista" y se reintenta.
        """
        def condicion(driver):
            try:
                filas = driver.find_elements(By.CSS_SELECTOR, "#cuerpoProductos tr")
                for fila in filas:
                    if nombre in fila.text:
                        return fila
            except StaleElementReferenceException:
                return False
            return False

        try:
            return WebDriverWait(self.driver, timeout).until(condicion)
        except TimeoutException:
            return None

    def buscar_fila_producto_por_nombre(self, nombre, intentos=5):
        """Busqueda inmediata (sin esperar el fetch), tolerante a stale.

        Util para verificar AUSENCIA de un producto (ej. tras
        desactivarlo), donde no queremos esperar el timeout completo.
        """
        for _ in range(intentos):
            try:
                for fila in self.filas_productos():
                    if nombre in fila.text:
                        return fila
                return None
            except StaleElementReferenceException:
                continue
        return None

    def agregar_producto_al_carrito(self, nombre):
        fila = self.esperar_fila_producto(nombre)
        fila.find_element(By.CSS_SELECTOR, "[data-agregar]").click()

    def desactivar_producto(self, nombre):
        fila = self.esperar_fila_producto(nombre)
        fila.find_element(By.CSS_SELECTOR, "[data-eliminar]").click()

    def esperar_producto_desaparece(self, nombre, timeout=10):
        """Espera a que un producto deje de estar en la tabla (tras desactivarlo)."""
        def condicion(driver):
            try:
                filas = driver.find_elements(By.CSS_SELECTOR, "#cuerpoProductos tr")
                return not any(nombre in fila.text for fila in filas)
            except StaleElementReferenceException:
                return False

        try:
            WebDriverWait(self.driver, timeout).until(condicion)
            return True
        except TimeoutException:
            return False

    def filas_carrito(self):
        return self.driver.find_elements(By.CSS_SELECTOR, "#cuerpoCarrito tr")

    def obtener_total_carrito(self):
        return self.driver.find_element(By.ID, "totalCarrito").text

    def click_confirmar_pedido(self):
        self.driver.find_element(By.ID, "btnCrearPedido").click()

    def obtener_mensaje_error_pedido(self, timeout=10):
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.ID, "mensajeErrorPedido"))
        )

    def obtener_mensaje_exito_pedido(self, timeout=10):
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.ID, "mensajeExitoPedido"))
        )

    def filas_pedidos(self, intentos=5):
        for _ in range(intentos):
            try:
                return self.driver.find_elements(By.CSS_SELECTOR, "#cuerpoPedidos tr")
            except StaleElementReferenceException:
                continue
        return self.driver.find_elements(By.CSS_SELECTOR, "#cuerpoPedidos tr")

    def esperar_pedido_con_producto(self, nombre_producto, timeout=15):
        """Espera a que termine el fetch y el pedido aparezca en la tabla.

        Tolera StaleElementReferenceException dentro del propio poll:
        si la tabla se redibuja mientras se lee el texto de una fila,
        se trata como "todavia no esta listo" y se reintenta.
        """
        def condicion(driver):
            try:
                filas = driver.find_elements(By.CSS_SELECTOR, "#cuerpoPedidos tr")
                return any(nombre_producto in fila.text for fila in filas)
            except StaleElementReferenceException:
                return False

        WebDriverWait(self.driver, timeout).until(condicion)
        return self.filas_pedidos()

    def click_logout(self):
        self.driver.find_element(By.ID, "btnLogout").click()
