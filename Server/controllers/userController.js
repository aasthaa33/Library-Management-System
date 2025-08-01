const User = require("../models/User");
const bcrypt = require("bcrypt");

const CreateUser = async(req, res) => {
    const { name, email, password, role, phone } = req.body;    
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }   
    try{
        const UserExists = await User.findOne({email});
        if(UserExists){
            return res.status(400).json({message: "User already exists"});
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
        res.status(201).json({ message: "User created successfully", user });
    }catch(err) {
        res.status(500).json({ message: "Failed to create User", error: err.message });
    }
};

const getUserById = async (req, res) =>{
    try{
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }catch(err) {
        res.status(500).json({ message: "Error retrieving user", error: err.message });
    }
};

const updateUser = async (req, res) =>{
    try{
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const updateData = req.body;
       
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json({message: "Failed to update"});
    }
};

const deleteUser = async(req, res) =>{
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try{
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }catch(err){
        res.status(500).json({message: "Failed to delete user", error: err.message});
    }
}

module.exports ={
    CreateUser,
    getUserById,
    updateUser,
    deleteUser
}