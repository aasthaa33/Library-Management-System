const express = require("express");
const router = express.Router();
const { borrowBook,
    returnBook} = require("../controllers/borrowController");
const checkRole = require("../middleware/roleMiddleware");  

router.post("/borrow", checkRole("borrower"), borrowBook);
router.post("/return", checkRole("borrower"), returnBook);          
module.exports = router;