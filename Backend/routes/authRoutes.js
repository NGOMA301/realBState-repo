import express from "express";
import { body } from "express-validator";
import { login, logout, profile, signup, updateProfile } from "../controlers/user.controler.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../utils/multerConfig.js";

export const authRouter = express.Router();

// Signup Route
authRouter.post(
  "/signup",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long"),
    body("phoneNumber")
      .isNumeric()
      .withMessage("Phone number should be numeric"),
    body("address.city").not().isEmpty().withMessage("City is required"),
    body("address.street").not().isEmpty().withMessage("Street is required"),
  ],
  signup
);

// Login Route
authRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  login
);
authRouter.post(
  "/logout",
  
  logout
);

authRouter.get("/profile", authenticateToken, profile)



authRouter.put(
  "/edit/profile",
  authenticateToken,
  uploadMiddleware,
  [
    body("name").optional().not().isEmpty().withMessage("Name cannot be empty"),
    body("phoneNumber")
      .optional()
      .isNumeric()
      .withMessage("Phone number should be numeric"),
    body("address.city").optional().not().isEmpty().withMessage("City is required"),
    body("address.street").optional().not().isEmpty().withMessage("Street is required"),
  ],
  updateProfile
);