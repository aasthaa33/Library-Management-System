const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },

    borrowDate: {
        type: Date,
        Default: Date.now
    },
    returnDate: {
        type: Date,
        Default: null
    },
    fineAmount: {
        type: Number
    }
});

module.exports = mongoose.model("Borrow", borrowSchema);