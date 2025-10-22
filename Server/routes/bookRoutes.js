const express = require("express");
const router = express.Router();
const { addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook} = require("../controllers/bookController");
const {authMiddleware} = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

router.get("/", getBooks);
router.get("/:id", getBookById);

router.post("/",authMiddleware, checkRole("librarian"), addBook);

router.put("/:id",authMiddleware, checkRole("librarian"), updateBook);
router.delete("/:id",authMiddleware, checkRole("librarian"), deleteBook);
module.exports = router;