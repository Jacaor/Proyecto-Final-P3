const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { JWT_SECRET } = require("../middleware/auth");

async function register(req, res) {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: "faltan datos" });
  }

  const existe = userModel.findByCorreo(correo);
  if (existe) {
    return res.status(409).json({ error: "ese correo ya esta registrado" });
  }

  const hash = await bcrypt.hash(password, 10);
  const nuevo = userModel.create({ nombre, correo, passwordHash: hash });

  res.status(201).json({ id: nuevo.id, nombre: nuevo.nombre, correo: nuevo.correo });
}

async function login(req, res) {
  const { correo, password } = req.body;
  const user = userModel.findByCorreo(correo);

  if (!user) {
    return res.status(401).json({ error: "credenciales invalidas" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "credenciales invalidas" });
  }

  const token = jwt.sign({ id: user.id, correo: user.correo }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
}

function perfil(req, res) {
  const user = userModel.findById(req.usuario.id);
  if (!user) return res.status(404).json({ error: "usuario no encontrado" });

  res.json({ id: user.id, nombre: user.nombre, correo: user.correo });
}

module.exports = { register, login, perfil };
