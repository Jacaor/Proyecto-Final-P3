def test_logout_redirige_al_login_y_bloquea_dashboard(dashboard_autenticado, base_url):
    """HU12: cerrar sesion borra el token y bloquea el acceso directo al dashboard."""
    driver = dashboard_autenticado.driver

    dashboard_autenticado.click_logout()
    driver.implicitly_wait(3)
    assert "login.html" in driver.current_url

    driver.get(base_url + "/dashboard.html")
    driver.implicitly_wait(3)
    assert "login.html" in driver.current_url
