import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token

  if (!token) {
    return res.status(401).json({ message: "Authentication required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token; // Get token from headers
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const user = await User.findById(decoded.userId); // Find user by ID

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};