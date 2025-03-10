import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import { send2FACode } from "../utils/emailSender.js";

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
  console.log(req.body);
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

    res
      .status(201)
      .json({ message: "User created successfully", data: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate full access JWT for normal users
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    });

    const userData = user.toObject();
    delete userData.password; // Remove password from response

    res.json({
      message: "Login successful",
      user: userData,
      accessLevel: user.role === "admin" ? "admin" : "user",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
//admin login
export const adLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Admin-specific 2FA flow
    if (user.role === "admin") {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedCode = await bcrypt.hash(code, 10);

      user.twoFactorCode = hashedCode;
      user.twoFactorExpires = Date.now() + 15 * 60 * 1000; // 15 mins expiry
      await user.save();

      await send2FACode(user.email, code); // Send 2FA code to admin email

      // Temporary token to allow only 2FA verification
      const tempToken = jwt.sign(
        { userId: user._id, needs2FA: true },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.cookie("temp_auth_token", tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, // 15 mins
      });

      return res.json({
        message: "2FA required for admin access",
        requires2FA: true,
      });
    }

    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verify2FA = async (req, res) => {
  const { code } = req.body;
  const tempToken = req.cookies.temp_auth_token;

  if (!tempToken) {
    return res
      .status(401)
      .json({ message: "2FA session expired. Login again." });
  }

  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.twoFactorCode || user.twoFactorExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired 2FA code." });
    }

    const isMatch = await bcrypt.compare(code, user.twoFactorCode);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect 2FA code." });
    }

    // Generate full access token
    const token = jwt.sign(
      { userId: user._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.cookie("auth_ad_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    });

    // Reset 2FA fields
    user.twoFactorCode = undefined;
    user.twoFactorExpires = undefined;
    await user.save();

    // Remove sensitive data
    const userData = user.toObject();
    delete userData.password;

    res.clearCookie("temp_auth_token"); // Remove temp token after successful verification

    res.json({
      message: "2FA verified, login successful",
      accessLevel: "admin",
      user: userData,
    });
  } catch (err) {
    console.error("2FA Verification error:", err);
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
export const adLogout = (req, res) => {
  res.clearCookie("auth_ad_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only clear secure cookie in production
    sameSite: "strict",
  });

  res.json({ message: "Logout successful" });
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//updateProfile controller
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phoneNumber, currentPassword, newPassword, ...otherFields } =
    req.body;
  const updates = {};

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Handle file upload (Profile Image)
    if (req.file) {
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, `../${user.profileImage}`);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updates.profileImage = `/uploads/userImages/${req.file.filename}`;
    }

    // 🔹 Handle address fields
    const addressUpdates = {};
    if (otherFields["address.city"])
      addressUpdates.city = otherFields["address.city"];
    if (otherFields["address.street"])
      addressUpdates.street = otherFields["address.street"];

    if (Object.keys(addressUpdates).length > 0) {
      updates.address = { ...user.address, ...addressUpdates };
    }

    // 🔹 Update other fields
    if (name) updates.name = name;
    if (phoneNumber) updates.phoneNumber = phoneNumber;

    // 🔹 Update Password (If provided)
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(newPassword, salt);
    }

    // 🔹 Save updated user data
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

// Get All Users Controller (Admin-only)
export const getAllUsers = async (req, res) => {
  try {
    // 1. Authorization Check
    const requestingUser = await User.findById(req.userId);
    if (!requestingUser || requestingUser.role !== "admin") {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "Insufficient privileges to access this resource",
      });
    }

    // 2. Input Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        errors: errors.array(),
      });
    }
    const totalUsers = await User.countDocuments({});
    // 3. Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const maxLimit = 100; // Prevent denial-of-service through large requests

    if (page < 1 || limit < 1 || limit > maxLimit) {
      return res.status(400).json({
        code: "INVALID_PAGINATION",
        message: `Pagination parameters out of bounds (1-${maxLimit})`,
      });
    }

      // 4. Search Query (By Name, Email, or Role)
      const searchQuery = req.query.search || "";
      const filter = {};
  
      if (searchQuery) {
        const regex = new RegExp(searchQuery, "i"); // Case-insensitive regex search
        filter.$or = [
          { name: regex }, 
          { email: regex }, 
          { role: regex }
        ];
      }
  

    // 5. Database Operation
    const [users, totalCount] = await Promise.all([
      User.find(filter)
        .select("-password -__v -refreshToken") // Exclude sensitive fields
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    // 6. Response Formatting
    res
      .set("Cache-Control", "no-store, max-age=0") // Prevent caching of sensitive data
      .json({
        code: "USERS_RETRIEVED",
        message: "Users retrieved successfully",
        data: {
          users,
          totalUsers,
          pagination: {
            total: totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit),
            limit,
          },
        },
        meta: {
          requestedBy: requestingUser.email,
          timestamp: new Date().toISOString(),
        },
      });
  } catch (err) {
    // 7. Error Handling
    console.error(`[${new Date().toISOString()}] User Fetch Error:`, err);

    const errorCode =
      err.name === "CastError" ? "INVALID_INPUT" : "SERVER_ERROR";

    res.status(500).json({
      code: errorCode,
      message: "Error processing user data request",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
