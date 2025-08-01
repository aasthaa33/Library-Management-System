const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String, unique: true },
    password: {
        type: String,
        required: true
    },
    role: { type: String, 
        enum: ["borrower" , "librarian"]
    },
    phone: {type: String},
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);
