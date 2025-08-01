const Book = require("../models/Book");

const addBook = async(req, res) =>{
    try{
    const book = new Book (req.body);
    book.available = req.body.quantity;

    await book.save();
    res.status(201).json({message: 'Book added successfully', book});
    } catch(err){
        res.status(400).json({message: "Unable to add book", error: err.message});
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
    

const getBookById = async(req, res) => {
    const bookId = req.params.id;

    if(!bookId){
        return res.status(400).json({message: "Book ID is required"});
    }
    try{
        const book = await Book.find(bookId);
        return res.status(200).json(book);
    }catch(err){
        return res.status(404).json({message: "Book not found", error: err.message});
    }
};


const updateBook = async(req, res) => {
    const bookId = req.params.id;
    const updateData = req.body;

    if(!bookId){
        return res.status(400).json({message: "Bood Id is missing"});
    }

    if(!updateData || Object.keys(updateData).length === 0){
        return res.status(400).json({message: "No data to update"});
    }

    try{
        const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {new: true});
        
        if(!updatedBook){
            return res.status(404).json({message: "Book not found."});
        }

        return res.status(200).json(updatedBook);
    }catch(err){
        res.status(500).json({message: "Update failed.", error: err.message});
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
            res.status(404).json({message: "Book not found"});
        }

        return res.status(200).json({message: "Book deleted successfully."});
    }catch(err){
        return res.status(500).json({message: "Error deleting book", error: err.messaGE});
    }
};

module.exports ={
    addBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};
