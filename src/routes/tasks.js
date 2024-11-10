const express = require('express');
const router = express.Router();
const tasksController = require("../app/controller/TasksController");
const { checkOwnership, checkOwnershipTrash} = require("../app/middleware/authorizeMiddleware");
const {checkOwnershipHandleActionTrash, checkOwnershipHandleAction } = require("../app/middleware/authorizeMiddleware");

router.patch("/:id/undo", checkOwnership, tasksController.unDo);
router.post("/trash-handle-action", checkOwnershipHandleActionTrash, tasksController.trashHandleAction);
router.post("/handle-action", checkOwnershipHandleAction, tasksController.handleAction);
router.get("/:id/edit", checkOwnership, tasksController.edit);
router.put("/:id/update", checkOwnership, tasksController.update);
router.patch("/:id/restore", checkOwnershipTrash, tasksController.restore);
router.patch("/:id/completed", checkOwnership, tasksController.completed);
router.delete("/:id", checkOwnership, tasksController.delete);
router.delete("/:id/destroy", checkOwnershipTrash, tasksController.destroy);
router.get("/create", tasksController.create);
router.get("/search", tasksController.search);
router.post("/save-list", tasksController.saveList);
router.get("/:slug", tasksController.detail);
router.get("/", tasksController.index);

module.exports = router;