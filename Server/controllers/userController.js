const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ Create User
const CreateUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return res.status(400).json({ message: "Name must contain only letters and spaces" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const UserExists = await User.findOne({ email });
    if (UserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone
    });

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create User", error: err.message });
  }
};

// ✅ Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user", error: err.message });
  }
};

// ✅ Update User
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const updates = {};

    if (name) {
      if (!/^[A-Za-z\s]+$/.test(name)) {
        return res.status(400).json({ message: "Name must contain only letters and spaces" });
      }
      updates.name = name;
    }

    if (email) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      updates.email = email;
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    if (role) updates.role = role;
    if (phone) updates.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

// ✅ Get All Users (filter by role with query param)
const getAllUsers = async (req, res) => {
  try {
    const role = req.query.role; // e.g., ?role=librarian
    const query = role ? { role } : {};
    const users = await User.find(query).select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// ✅ Update User Status (active/inactive)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Status updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

module.exports = {
  CreateUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserStatus,
};
