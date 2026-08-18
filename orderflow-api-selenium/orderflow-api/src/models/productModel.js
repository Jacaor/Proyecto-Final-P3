let productos = [];
let contador = 1;

function reset() {
  productos = [];
  contador = 1;
}

function create({ nombre, precio, stock }) {
  const p = { id: contador++, nombre, precio, stock, activo: true };
  productos.push(p);
  return p;
}

function findAll() {
  return productos.filter((p) => p.activo);
}

function findById(id) {
  return productos.find((p) => p.id === Number(id));
}

function update(id, data) {
  const p = findById(id);
  if (!p) return null;

  Object.assign(p, data);
  return p;
}

function remove(id) {
  const p = findById(id);
  if (!p) return null;

  p.activo = false;
  return p;
}

function lowStock(umbral = 5) {
  return productos
    .filter((p) => p.activo && p.stock <= umbral)
    .sort((a, b) => a.stock - b.stock);
}

module.exports = { create, findAll, findById, update, remove, lowStock, reset };
