const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());


const connectDB = require("./db");
connectDB();


const authRoutes = require("./routes/authRoutes");
const borrowRoutes = require("./routes/borrowRoutes");     
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
