const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkRole = require("../middleware/roleMiddleware");

router.post("/", checkRole("librarian"), userController.CreateUser);
router.get("/:id", checkRole("librarian", "borrower"), userController.getUserById);
router.put("/:id", checkRole("librarian"), userController.updateUser);
router.delete("/:id", checkRole("librarian"), userController.deleteUser);

module.exports = router;

