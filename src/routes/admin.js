const express = require('express');
const router = express.Router();
const adminController = require("../app/controller/AdminController");

router.get("/dashboard", adminController.dashboard);
router.post("/tag-create", adminController.createTag);

module.exports = router;
