const express = require("express");
const router = express.Router();
const { addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook} = require("../controllers/bookController");

const checkRole = require("../middleware/roleMiddleware");
router.post("/", checkRole("librarian"), addBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", checkRole("librarian"), updateBook);
router.delete("/:id", checkRole("librarian"), deleteBook);
module.exports = router;