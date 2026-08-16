const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

// ✅ Create user (admin only)
router.post("/", auth.authMiddleware, checkRole("admin"), userController.CreateUser);

// ✅ Get all users — must be before /:id to avoid "all" being treated as an id
router.get("/", auth.authMiddleware, checkRole("admin"), userController.getAllUsers);

// ✅ Get single user by ID
router.get("/:id", auth.authMiddleware, checkRole("admin", "librarian", "borrower"), userController.getUserById);

// ✅ Update user status (PUT /:id/status must come before PUT /:id)
router.put("/:id/status", auth.authMiddleware, checkRole("admin"), userController.updateUserStatus);

// ✅ Update user
router.put("/:id", auth.authMiddleware, checkRole("admin", "librarian"), userController.updateUser);

// ✅ Delete user (admin only)
router.delete("/:id", auth.authMiddleware, checkRole("admin"), userController.deleteUser);

module.exports = router;
