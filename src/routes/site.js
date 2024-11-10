const express = require('express');
const router = express.Router();
const siteController = require("../app/controller/SiteController");

router.get("/login", siteController.login);
router.get("/sign-up", siteController.signUp);
router.get("/", siteController.index);

module.exports = router;