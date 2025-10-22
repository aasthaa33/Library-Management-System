const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

// ✅ Create user (admin only)
router.post("/", auth.authMiddleware, checkRole("admin"), userController.CreateUser);

// ✅ Get single user by ID (admin, librarian, borrower)
router.get("/:id", auth.authMiddleware, checkRole("admin", "librarian", "borrower"), userController.getUserById);

// ✅ Update user (admin, librarian)
router.put("/:id", auth.authMiddleware, checkRole("admin", "librarian"), userController.updateUser);

// ✅ Delete user (admin only)
router.delete("/:id", auth.authMiddleware, checkRole("admin"), userController.deleteUser);

// ✅ Get all users (filter by role using query string, e.g., /api/users?role=librarian)
router.get("/", auth.authMiddleware, checkRole("admin"), userController.getAllUsers);

// ✅ Update user status only (PATCH request)
router.patch("/:id/status", auth.authMiddleware, checkRole("admin"), userController.updateUserStatus);

module.exports = router;
