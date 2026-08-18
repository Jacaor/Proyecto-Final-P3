from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class LoginPage:
    URL_PATH = "/login.html"

    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def abrir(self):
        self.driver.get(self.base_url + self.URL_PATH)

    def ingresar_correo(self, correo):
        self.driver.find_element(By.ID, "correo").send_keys(correo)

    def ingresar_password(self, password):
        self.driver.find_element(By.ID, "password").send_keys(password)

    def click_entrar(self):
        self.driver.find_element(By.ID, "btnLogin").click()

    def login(self, correo, password):
        self.abrir()
        self.ingresar_correo(correo)
        self.ingresar_password(password)
        self.click_entrar()

    def obtener_mensaje_error(self, timeout=10):
        """Espera a que el fetch termine y el mensaje de error se muestre."""
        return WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.ID, "mensajeError"))
        )

    def esperar_dashboard(self, timeout=10):
        """Espera a que el fetch termine y se redirija al dashboard."""
        WebDriverWait(self.driver, timeout).until(EC.url_contains("dashboard.html"))

    def ir_a_registro(self):
        self.driver.find_element(By.LINK_TEXT, "No tengo cuenta, quiero registrarme").click()
