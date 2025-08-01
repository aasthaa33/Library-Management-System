const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

const borrowBook = async(req, res) =>{
    const { bookId } = req.body;
    const userId = req.user._id; 

    if (!userId || !bookId) {
        return res.status(400).json({ message: "User ID and Book ID are required" });
    }

    try {
        const book = await Book.findById(bookId);
        if (!book || book.available < 1) {
            return res.status(404).json({ message: "Book not available" });
        }

        const borrow = new Borrow({
            userId,
            bookId,
            borrowDate: new Date(),
        });

        book.available -= 1;
        await book.save();
        await borrow.save();

        res.status(201).json({ message: "Book borrowed successfully", borrow });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }

};

const returnBook = async(req,res) => {
    const {bookId} = req.body;
    const userId = req.user._id;

    if (!userId || !bookId) {
        return res.status(400).json({ message: "User ID and Book ID are required" });
    }
    try{
        const borrow = await Borrow.findOne({userId, bookId, returnDate: null});
        if(!borrow){
         return res.status(404).json({message: "No borrow record found"})};

        borrow.returnDate = new Date();
        await borrow.save();

        const book = await Book.findById(bookId);
        if(book){
        book.available += 1;
            await book.save()};

        res.status(200).json({message: "Book returned successfully", borrow});
    } catch(err) {
        res.status(500).json({message: "Return failed", error: err.message});     
}
};

module.exports ={
    borrowBook,
    returnBook
}