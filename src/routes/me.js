const express = require('express');
const router = express.Router();
const meController = require("../app/controller/MeController");
const upload = require("../app/middleware/multerMiddleware");

router.get("/profile", meController.profile);
router.get("/profile-avarta", meController.profileAvatar);
router.get("/profile-password", meController.profilePassword);
router.post("/profile-update", meController.profileUpdate);
router.post("/upload-avarta",upload.single('avarta'), meController.updateAvatar);
router.post("/change-password", meController.changePassword);
router.get("/my-tags", meController.myTags);
router.get("/mylist", meController.mylist);
router.get("/trash-task", meController.trashTask);
router.get("/history-task", meController.historyTask);
router.get("/tags/:id", meController.detailTag);

module.exports = router;