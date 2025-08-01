const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())

mongoose.connect("mongodb://localhost:27017/hrms_db")
.then(() => console.log("connected to MongoDB"))
.catch((err) => console.log(err));

const authRoutes = require("./routes/authRoutes")
const borrowRoutes = require("./routes/borrowRoutes")      
const authMiddleware = require("./middleware/authMiddleware")
const userRoutes = require("./routes/userRoutes")
const bookRoutes = require("./routes/bookRoutes")

app.use("/api/auth", authRoutes);
app.use("/api/borrow", authMiddleware, borrowRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/books", authMiddleware, bookRoutes);


const PORT = 5000
app.listen(PORT, () => console.log("Connected to server")) 