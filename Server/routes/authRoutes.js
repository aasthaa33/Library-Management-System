const express = require("express");
const router = express.Router();
const { register, login, registerLibrarian, getMe, updateMe } = require("../controllers/authControllers");
const { authMiddleware } = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const { uploadAvatar } = require("../middleware/upload");

router.post("/register", register);
router.post("/login", login);

router.post("/register-librarian", authMiddleware, checkRole("admin"), registerLibrarian);

// Own profile
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, uploadAvatar.single("avatar"), updateMe);

module.exports = router;
