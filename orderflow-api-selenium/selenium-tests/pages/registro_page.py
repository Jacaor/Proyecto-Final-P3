from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class RegistroPage:
    URL_PATH = "/registro.html"

    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def abrir(self):
        self.driver.get(self.base_url + self.URL_PATH)

    def registrar(self, nombre, correo, password):
        self.abrir()
        self.driver.find_element(By.ID, "nombre").send_keys(nombre)
        self.driver.find_element(By.ID, "correo").send_keys(correo)
        self.driver.find_element(By.ID, "password").send_keys(password)
        self.driver.find_element(By.ID, "btnRegistro").click()

    def obtener_mensaje_error(self, timeout=10):
        """Espera a que el fetch termine y el mensaje de error se muestre."""
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.ID, "mensajeError"))
        )

    def obtener_mensaje_exito(self, timeout=10):
        """Espera a que el fetch termine y el mensaje de exito se muestre."""
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.ID, "mensajeExito"))
        )
