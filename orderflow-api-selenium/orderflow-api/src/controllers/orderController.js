const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

function crear(req, res) {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "el pedido necesita al menos un producto" });
  }

  // primero valido todo, si algo falla no toco el inventario
  const revisados = [];
  for (const item of items) {
    const producto = productModel.findById(item.productoId);

    if (!producto || !producto.activo) {
      return res.status(404).json({ error: `producto ${item.productoId} no existe` });
    }
    if (producto.stock < item.cantidad) {
      return res.status(400).json({ error: `no hay suficiente stock de ${producto.nombre}` });
    }

    revisados.push({ producto, cantidad: item.cantidad });
  }

  let total = 0;
  const itemsFinales = [];

  for (const r of revisados) {
    productModel.update(r.producto.id, { stock: r.producto.stock - r.cantidad });
    total += r.producto.precio * r.cantidad;
    itemsFinales.push({
      productoId: r.producto.id,
      nombre: r.producto.nombre,
      cantidad: r.cantidad,
      precioUnitario: r.producto.precio,
    });
  }

  const pedido = orderModel.create({ usuarioId: req.usuario.id, items: itemsFinales, total });
  res.status(201).json(pedido);
}

function obtener(req, res) {
  const pedido = orderModel.findById(req.params.id);
  if (!pedido) return res.status(404).json({ error: "pedido no encontrado" });

  if (pedido.usuarioId !== req.usuario.id) {
    return res.status(403).json({ error: "no puedes ver este pedido" });
  }

  res.json(pedido);
}

function listarMios(req, res) {
  res.json(orderModel.findByUsuario(req.usuario.id));
}

module.exports = { crear, obtener, listarMios };
