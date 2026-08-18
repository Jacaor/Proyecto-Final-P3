const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "orderflow_dev_secret";

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "token no proporcionado" });
  }

  const token = header.split(" ")[1];

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "token invalido o expirado" });
  }
}

module.exports = { requireAuth, JWT_SECRET };
