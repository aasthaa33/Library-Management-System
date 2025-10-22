const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- add this to handle form-data
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



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
