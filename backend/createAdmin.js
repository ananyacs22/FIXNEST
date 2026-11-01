
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    }

    if (password.length < 8) {
      throw new Error("Admin password must be at least 8 characters");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("This email already exists. Choose a new admin email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "FIXNEST Admin",
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin account created successfully!");
  } catch (error) {
    console.error("Admin setup failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
