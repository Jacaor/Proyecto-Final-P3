document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formRegistro");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  form.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    mensajeError.style.display = "none";
    mensajeExito.style.display = "none";

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const respuesta = await apiFetch("/auth/registro", {
      method: "POST",
      body: { nombre: nombre, correo: correo, password: password },
    });

    if (!respuesta.ok) {
      mensajeError.textContent = respuesta.datos.error || "no se pudo registrar";
      mensajeError.style.display = "block";
      return;
    }

    mensajeExito.textContent = "cuenta creada, ya puedes iniciar sesion";
    mensajeExito.style.display = "block";
    form.reset();
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1200);
  });
});
