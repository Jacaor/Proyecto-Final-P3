const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { requireAuth } = require("../middleware/auth");

router.get("/stock-bajo", requireAuth, productController.stockBajo);
router.get("/", productController.listar);
router.get("/:id", productController.obtener);
router.post("/", requireAuth, productController.crear);
router.put("/:id", requireAuth, productController.actualizar);
router.delete("/:id", requireAuth, productController.eliminar);

module.exports = router;
