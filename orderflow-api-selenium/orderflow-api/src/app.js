const express = require("express");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/auth", authRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/pedidos", orderRoutes);

app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

module.exports = app;
