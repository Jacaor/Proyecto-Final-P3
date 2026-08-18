const productModel = require("../models/productModel");

function crear(req, res) {
  const { nombre, precio, stock } = req.body;

  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: "faltan datos del producto" });
  }

  const producto = productModel.create({ nombre, precio, stock });
  res.status(201).json(producto);
}

function listar(req, res) {
  res.json(productModel.findAll());
}

function obtener(req, res) {
  const producto = productModel.findById(req.params.id);

  if (!producto || !producto.activo) {
    return res.status(404).json({ error: "producto no encontrado" });
  }

  res.json(producto);
}

function actualizar(req, res) {
  const producto = productModel.update(req.params.id, req.body);
  if (!producto) return res.status(404).json({ error: "producto no encontrado" });

  res.json(producto);
}

function eliminar(req, res) {
  const producto = productModel.remove(req.params.id);
  if (!producto) return res.status(404).json({ error: "producto no encontrado" });

  res.json({ mensaje: "producto desactivado" });
}

function stockBajo(req, res) {
  const umbral = Number(req.query.umbral) || 5;
  res.json(productModel.lowStock(umbral));
}

module.exports = { crear, listar, obtener, actualizar, eliminar, stockBajo };
