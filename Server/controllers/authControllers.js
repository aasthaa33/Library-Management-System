const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });

    if (!/^[A-Za-z\s]+$/.test(name))
      return res.status(400).json({ message: "Name must contain only letters and spaces" });

    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "borrower"
    });
    await user.save();

    const token = signToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: "Server error" });
  }
};


exports.registerLibrarian = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "librarian",
    });
    await user.save();

    res.status(201).json({
      message: "Librarian created successfully",
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Register Librarian Error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async(req, res) =>{
    try{
    const{email, password} = req.body;

    if(!email || !password) return res.status(400).json({message: "Email and passsword are required" });

    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: "Invalid email or password"});

    const currentPassword = await bcrypt.compare(password, user.password);
    if (!currentPassword) return res.status(400).json({message: "Invalid email or password"});


    const token = signToken(user);
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({token, 
        user: {
         id: user._id, 
         name: user.name, 
         role: user.role}
        });

}catch(err){
    res.status(500).json({message: "Server error"});
}};
