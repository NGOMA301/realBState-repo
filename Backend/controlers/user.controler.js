import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Signup Controller
export const signup = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phoneNumber, address } = req.body;
  console.log(req.body)
  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    // Set a cookie with the JWT token and user info (excluding password)
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
      secure: process.env.NODE_ENV === "production", // Only set secure cookie in production
    });

    // Remove password before sending user data
    const userData = { ...user.toObject() };
    delete userData.password;

    res.status(201).json({ message: "User created successfully", data: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    // Set a cookie with the JWT token and user info (excluding password)
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
      secure: process.env.NODE_ENV === "production", // Only set secure cookie in production
    });

    // Remove password before sending user data
    const userData = { ...user.toObject() };
    delete userData.password;

    res.json({ message: "Login successful", user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout Controller
export const logout = (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only clear secure cookie in production
    sameSite: "strict",
  });

  res.json({ message: "Logout successful" });
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}



//updateProfile controller
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phoneNumber, ...otherFields } = req.body;
  const updates = {};
  
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle file upload
    if (req.file) {
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, `../${user.profileImage}`);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updates.profileImage = `/uploads/userImages/${req.file.filename}`;
    }

    // Handle address fields
    const addressUpdates = {};
    if (otherFields['address.city']) addressUpdates.city = otherFields['address.city'];
    if (otherFields['address.street']) addressUpdates.street = otherFields['address.street'];
    
    // Only add address to updates if there are changes
    if (Object.keys(addressUpdates).length > 0) {
      updates.address = {
        ...user.address,
        ...addressUpdates
      };
    }

    // Update other fields
    if (name) updates.name = name;
    if (phoneNumber) updates.phoneNumber = phoneNumber;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};