let usuarios = [];
let contador = 1;

function reset() {
  usuarios = [];
  contador = 1;
}

function create({ nombre, correo, passwordHash }) {
  const u = { id: contador++, nombre, correo, passwordHash };
  usuarios.push(u);
  return u;
}

function findByCorreo(correo) {
  return usuarios.find((u) => u.correo === correo);
}

function findById(id) {
  return usuarios.find((u) => u.id === Number(id));
}

module.exports = { create, findByCorreo, findById, reset };
