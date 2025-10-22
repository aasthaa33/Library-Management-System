const express = require("express");
const router = express.Router();
const { register, login, registerLibrarian } = require("../controllers/authControllers");
const { authMiddleware } = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");


router.post("/register", register);  
router.post("/login", login);


router.post("/register-librarian", authMiddleware, checkRole("admin"), registerLibrarian);

module.exports = router;
