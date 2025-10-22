
const express = require("express");
const router = express.Router();
const { borrowBook, returnBook, getAllBorrows, getBorrows} = require("../controllers/borrowController");
const {authMiddleware} = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");  

router.post("/borrow", authMiddleware,checkRole("borrower"), borrowBook);
router.post("/return",authMiddleware, checkRole("borrower"), returnBook); 
router.get("/my",authMiddleware, checkRole("borrower"), getBorrows);

router.get("/all",authMiddleware, checkRole("librarian"), getAllBorrows);
module.exports = router;