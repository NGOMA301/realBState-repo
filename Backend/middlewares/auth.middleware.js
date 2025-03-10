import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    
    req.userId = decoded.userId;
    req.userRole = decoded.role; // Add role to request object
    next();
  });
};
export const authenticateAdminToken = (req, res, next) => {
  const token = req.cookies.auth_ad_token;
  
  if (!token) {
    return res.status(401).json({ message: "Authentication for admin required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired admin token" });
    }
    
    req.userId = decoded.userId;
    req.userRole = decoded.role; // Add role to request object
    next();
  });
};

export const authenticateUserOrAdmin = (req, res, next) => {
  const userToken = req.cookies.auth_token;
  const adminToken = req.cookies.auth_ad_token;

  if (!userToken && !adminToken) {
    return res.status(401).json({ message: "Authentication required" });
  }

  let token = userToken || adminToken;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    // Check if the token is for an admin
    req.isAdmin = !!adminToken; // If admin token exists, mark as admin

    next();
  });
};

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

export const verifyAdmin2FA = (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role === 'admin' && !decoded.is2FAVerified) {
      return res.status(403).json({ 
        code: '2FA_REQUIRED',
        message: '2FA verification required for admin access'
      });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};


export const adminAuth = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};