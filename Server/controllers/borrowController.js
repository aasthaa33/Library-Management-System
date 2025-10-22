const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

const borrowBook = async(req, res) =>{
    const { bookId } = req.body;
    const userId = req.user.id; 

    if (!userId || !bookId) {
        return res.status(400).json({ message: "User ID and Book ID are required" });
    }

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });
        if(book.available < 1)return res.status(400).json({message: "No copies available"});
        
        const existing = await Borrow.findOne({ userId, bookId, returnDate: null });
        if (existing) return res.status(400).json({ message: "You already borrowed this book" });

        book.available -= 1;
        await book.save();

        const borrow = await Borrow.create({
            userId,
            bookId,
            borrowDate: new Date(),
            returnDate: null
        });
        
        res.status(201).json({ message: "Book borrowed ", borrow });
    } catch (err) {
        res.status(500).json({ message: "Borrow failed", error: err.message });
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

        const book = await Book.findById(borrow.bookId);
        if(book){
         book.available += 1;
         if (book.available > book.quantity) book.available = book.quantity;
          await book.save()};

        res.status(200).json({message: "Book returned successfully", borrow});
    } catch(err) {
        res.status(500).json({message: "Return failed", error: err.message});     
}
};

const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find().populate('userId', 'name email').populate('bookId', 'title author isbn');
    return res.status(200).json({ borrows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch borrow records", error: err.message });
  }
};

const getBorrows = async (req, res) => {
    try{
       const borrows = await Borrow.find({ userId: req.user.id }).populate('bookId', 'title author isbn');
    return res.status(200).json({ borrows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch borrow records", error: err.message });
  }
};

   

module.exports ={
    borrowBook,
    returnBook,
    getAllBorrows,
    getBorrows
}