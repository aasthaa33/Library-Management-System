const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try{
    const{name, email, password, role, phone} = req.body;
    const existingUser = await User.findOne({ $or: [{name}, {email}]});
    if(existingUser) return res.status(400).json({message: 'Username or email already exists'});

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User ({name, email, password: hashedPassword, role, phone});
    await user.save();


    res.status(201).json({message: 'User registered successfully', user});
} catch(err){
    res.status(500).json({message: 'Server error'});
} 
};


exports.login = async(req, res) =>{
    try{
    const{email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: "Invalid email"});
    const currentPassword = await bcrypt.compare(password, user.passwordHash);
    if (!currentPassword) return res.status(400).json({message: "Invalid password"});


    const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({token, 
        user: {
         id: user._id, 
         name: user.name, 
         role: user.role}
        });

}catch(err){
    res.status(500).json({message: "Server error"});
}};