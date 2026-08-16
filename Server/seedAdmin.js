const connectDB = require("./db"); 
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User"); 

const seedAdmin = async () => {
  try {
    
    await connectDB();

    
    const existingAdmin = await User.findOne({ 
  $or: [{ role: "admin" }, { email: "ashwinshahi092@gmail.com" }] 
});
if (existingAdmin) {
  console.log("Admin already exists:", existingAdmin.email);
  process.exit(0);
}

 
    const hashedPassword = await bcrypt.hash("admin123", 10);

   
    const adminUser = new User({
      name: "Ashwin",
      email: "ashwinshahi092@gmail.com",
      password: hashedPassword,
      role: "admin",
      phone: "9812345678"
    });

    await adminUser.save();
    console.log(" Admin user created:", adminUser.email);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
