const Book = require("../models/Book");

const addBook = async (req, res) => {
  try {
    const { title, author, isbn, publisher, quantity } = req.body;

    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.status(400).json({ message: "A book with this ISBN already exists" });
    }

    const image = req.file ? `/uploads/books/${req.file.filename}` : "";  

    const book = new Book({
      title,
      author,
      isbn,
      publisher,
      quantity,
      available: quantity,
      image,  
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "A book with this ISBN already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};




const getBooks = async(req, res) => {
    try{
        const allBooks = await Book.find();
        return res.status(200).json(allBooks);
    }catch(err){
        return res.status(500).json({message: "Error retrieving books", error: err.message});
    }
};
    

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json({ book });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch book", error: err.message });
  }
};


const updateBook = async (req, res) => {
    const bookId = req.params.id;
    const updateData = req.body;

    if (!bookId) {
        return res.status(400).json({ message: "Book Id is missing" });
    }

    if (req.file) {
        updateData.image = `/uploads/books/${req.file.filename}`;   
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No data to update" });
    }

    try {
        if (updateData.isbn) {
            const other = await Book.findOne({ isbn: updateData.isbn, _id: { $ne: bookId } });
            if (other) return res.status(400).json({ message: "ISBN already in use" });
        }

        const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found." });
        }

        return res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: "Update failed.", error: err.message });
    }
};

const deleteBook = async(req, res) => {
    const bookId = req.params.id;

    if(!bookId){
        return res.status(400).json({message: "Book Id is required"});
    }
    try{
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if(!deletedBook){
            return res.status(404).json({message: "Book not found"});
        }

        return res.status(200).json({message: "Book deleted successfully."});
    }catch(err){
        return res.status(500).json({message: "Error deleting book", error: err.message});
    }
};

module.exports ={
    addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};
