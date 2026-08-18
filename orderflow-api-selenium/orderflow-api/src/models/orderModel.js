let pedidos = [];
let contador = 1;

function reset() {
  pedidos = [];
  contador = 1;
}

function create({ usuarioId, items, total }) {
  const pedido = {
    id: contador++,
    usuarioId,
    items,
    total,
    estado: "pendiente",
    creadoEn: new Date().toISOString(),
  };
  pedidos.push(pedido);
  return pedido;
}

function findById(id) {
  return pedidos.find((p) => p.id === Number(id));
}

function findByUsuario(usuarioId) {
  return pedidos.filter((p) => p.usuarioId === usuarioId);
}

module.exports = { create, findById, findByUsuario, reset };
