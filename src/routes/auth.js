const express = require('express');
const router = express.Router();
const authController = require("../app/controller/AuthController");
const { validateRegister, validateLogin } = require("../app/middleware/ValidateMiddleware");
const hashedPassword = require("../app/middleware/hashPasswordMiddleware");

router.post("/logout", authController.logout)
router.post("/login",validateLogin, authController.login);
router.post("/register",validateRegister,hashedPassword, authController.register);
router.get("/", authController.index);

module.exports = router;