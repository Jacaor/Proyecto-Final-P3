document.addEventListener("DOMContentLoaded", function () {
  if (obtenerToken()) {
    window.location.href = "dashboard.html";
    return;
  }

  const form = document.getElementById("formLogin");
  const mensajeError = document.getElementById("mensajeError");

  form.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    mensajeError.style.display = "none";

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const respuesta = await apiFetch("/auth/login", {
      method: "POST",
      body: { correo: correo, password: password },
    });

    if (!respuesta.ok) {
      mensajeError.textContent = respuesta.datos.error || "no se pudo iniciar sesion";
      mensajeError.style.display = "block";
      return;
    }

    guardarToken(respuesta.datos.token);
    window.location.href = "dashboard.html";
  });
});
