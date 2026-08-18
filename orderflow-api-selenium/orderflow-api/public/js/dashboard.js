let carrito = [];
let productosCache = [];

document.addEventListener("DOMContentLoaded", function () {
  if (!obtenerToken()) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("btnLogout").addEventListener("click", function () {
    borrarToken();
    window.location.href = "login.html";
  });

  document.getElementById("formProducto").addEventListener("submit", crearProducto);
  document.getElementById("btnCrearPedido").addEventListener("click", crearPedido);

  cargarPerfil();
  cargarProductos();
  cargarPedidos();
});

async function cargarPerfil() {
  const respuesta = await apiFetch("/auth/perfil");
  if (!respuesta.ok) {
    borrarToken();
    window.location.href = "login.html";
    return;
  }
  document.getElementById("perfilInfo").textContent =
    respuesta.datos.nombre + " - " + respuesta.datos.correo;
  document.getElementById("nombreUsuario").textContent = respuesta.datos.nombre;
}

async function cargarProductos() {
  const respuesta = await apiFetch("/productos");
  if (!respuesta.ok) return;

  productosCache = respuesta.datos;
  const cuerpo = document.getElementById("cuerpoProductos");
  cuerpo.innerHTML = "";

  productosCache.forEach(function (producto) {
    const fila = document.createElement("tr");
    fila.setAttribute("data-producto-id", producto.id);
    fila.innerHTML =
      "<td>" + producto.id + "</td>" +
      "<td>" + producto.nombre + "</td>" +
      "<td>$" + producto.precio.toFixed(2) + "</td>" +
      "<td class='stock-valor'>" + producto.stock + "</td>" +
      "<td>" +
      "<button class='btn-agregar-pedido' data-agregar='" + producto.id + "'>Agregar al pedido</button> " +
      "<button class='btn-eliminar' data-eliminar='" + producto.id + "'>Desactivar</button>" +
      "</td>";
    cuerpo.appendChild(fila);
  });

  cuerpo.querySelectorAll("[data-agregar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      agregarAlCarrito(boton.getAttribute("data-agregar"));
    });
  });

  cuerpo.querySelectorAll("[data-eliminar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      desactivarProducto(boton.getAttribute("data-eliminar"));
    });
  });
}

async function crearProducto(evento) {
  evento.preventDefault();
  const mensajeError = document.getElementById("mensajeErrorProducto");
  mensajeError.style.display = "none";

  const nombre = document.getElementById("nombreProducto").value;
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const stock = parseInt(document.getElementById("stockProducto").value, 10);

  const respuesta = await apiFetch("/productos", {
    method: "POST",
    body: { nombre: nombre, precio: precio, stock: stock },
  });

  if (!respuesta.ok) {
    mensajeError.textContent = respuesta.datos.error || "no se pudo crear el producto";
    mensajeError.style.display = "block";
    return;
  }

  document.getElementById("formProducto").reset();
  cargarProductos();
}

async function desactivarProducto(id) {
  const respuesta = await apiFetch("/productos/" + id, { method: "DELETE" });
  if (respuesta.ok) {
    cargarProductos();
  }
}

function agregarAlCarrito(productoId) {
  const producto = productosCache.find(function (p) {
    return String(p.id) === String(productoId);
  });
  if (!producto) return;

  const existente = carrito.find(function (item) {
    return String(item.productoId) === String(productoId);
  });

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ productoId: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }

  renderCarrito();
}

function renderCarrito() {
  const cuerpo = document.getElementById("cuerpoCarrito");
  cuerpo.innerHTML = "";
  let total = 0;

  carrito.forEach(function (item) {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + item.nombre + "</td>" +
      "<td>" + item.cantidad + "</td>" +
      "<td>$" + subtotal.toFixed(2) + "</td>";
    cuerpo.appendChild(fila);
  });

  document.getElementById("totalCarrito").textContent = "Total: $" + total.toFixed(2);
}

async function crearPedido() {
  const mensajeError = document.getElementById("mensajeErrorPedido");
  const mensajeExito = document.getElementById("mensajeExitoPedido");
  mensajeError.style.display = "none";
  mensajeExito.style.display = "none";

  if (carrito.length === 0) {
    mensajeError.textContent = "agrega al menos un producto al pedido";
    mensajeError.style.display = "block";
    return;
  }

  const items = carrito.map(function (item) {
    return { productoId: item.productoId, cantidad: item.cantidad };
  });

  const respuesta = await apiFetch("/pedidos", {
    method: "POST",
    body: { items: items },
  });

  if (!respuesta.ok) {
    mensajeError.textContent = respuesta.datos.error || "no se pudo crear el pedido";
    mensajeError.style.display = "block";
    return;
  }

  mensajeExito.textContent = "pedido creado con exito, id " + respuesta.datos.id;
  mensajeExito.style.display = "block";
  carrito = [];
  renderCarrito();
  cargarProductos();
  cargarPedidos();
}

async function cargarPedidos() {
  const respuesta = await apiFetch("/pedidos");
  if (!respuesta.ok) return;

  const cuerpo = document.getElementById("cuerpoPedidos");
  cuerpo.innerHTML = "";

  respuesta.datos.forEach(function (pedido) {
    const items = pedido.items.map(function (i) {
      return i.nombre + " x" + i.cantidad;
    }).join(", ");

    const fila = document.createElement("tr");
    fila.setAttribute("data-pedido-id", pedido.id);
    fila.innerHTML =
      "<td>" + pedido.id + "</td>" +
      "<td>" + items + "</td>" +
      "<td>$" + pedido.total.toFixed(2) + "</td>";
    cuerpo.appendChild(fila);
  });
}
