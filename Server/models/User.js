const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, unique: true,required: true,lowercase: true, trim: true  },
    password: {
        type: String,
        required: true
    },
    role: { type: String, 
        enum: ["admin", "librarian","borrower"],
        default: "borrower"
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    phone: {type: String},
    avatar: {type: String, default: ""},
    lastLogin: {type: Date}
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);
