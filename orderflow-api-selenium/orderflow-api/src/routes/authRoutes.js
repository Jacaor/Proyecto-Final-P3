const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

router.post("/registro", authController.register);
router.post("/login", authController.login);
router.get("/perfil", requireAuth, authController.perfil);

module.exports = router;
