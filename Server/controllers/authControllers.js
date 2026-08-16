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
    const { name, email, password,role, phone } = req.body;

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
      role,
      phone,
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

// Get own profile (any authenticated user)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update own profile (name, email, phone, avatar)
exports.updateMe = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updates = {};

    if (name) {
      if (!/^[A-Za-z\s]+$/.test(name))
        return res.status(400).json({ message: "Name must contain only letters and spaces" });
      updates.name = name;
    }

    if (email) {
      if (!/^\S+@\S+\.\S+$/.test(email))
        return res.status(400).json({ message: "Invalid email format" });
      const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existing) return res.status(400).json({ message: "Email already in use" });
      updates.email = email;
    }

    if (phone !== undefined) updates.phone = phone;

    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all users Admin only
exports.getAllUsers = async (req, res) =>{
  try{
    const users = await User.find().select("-password");
    res.status(200).json({users});
  } catch 
  (error){
    console.error("Get Users Error: ", err);
    res.status(500).json({message: "Server error"});
  }
};




// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin cannot delete their own account
    if (req.user.id === id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user status (admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Status updated", user });
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
