const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { requireAuth } = require("../middleware/auth");

router.post("/", requireAuth, orderController.crear);
router.get("/", requireAuth, orderController.listarMios);
router.get("/:id", requireAuth, orderController.obtener);

module.exports = router;
