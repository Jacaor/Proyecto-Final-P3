const API_BASE = "/api";

function guardarToken(token) {
  localStorage.setItem("orderflow_token", token);
}

function obtenerToken() {
  return localStorage.getItem("orderflow_token");
}

function borrarToken() {
  localStorage.removeItem("orderflow_token");
}

async function apiFetch(ruta, opciones) {
  opciones = opciones || {};
  const headers = opciones.headers || {};
  headers["Content-Type"] = "application/json";

  const token = obtenerToken();
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const respuesta = await fetch(API_BASE + ruta, {
    method: opciones.method || "GET",
    headers: headers,
    body: opciones.body ? JSON.stringify(opciones.body) : undefined,
  });

  const datos = await respuesta.json();
  return { ok: respuesta.ok, status: respuesta.status, datos: datos };
}
