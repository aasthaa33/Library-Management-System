const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true},
    author: {type: String, required: true, trim: true},
    isbn: {type: String, unique: true, required: true, trim:true},
    publisher: {type:String},
    quantity: {type: Number,
         required: true,
        min: 1},
    available: {type:Number, required: true},
    image: { type: String, default: "" }, 
},
{timestamps: true}
);

module.exports = mongoose.model("Book", bookSchema);

