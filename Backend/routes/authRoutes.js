import express from "express";
import { body, check } from "express-validator";
import { adLogin, adLogout, getAllUsers, login, logout, profile, signup, updateProfile, verify2FA } from "../controlers/user.controler.js";
import { authenticateAdminToken, authenticateToken } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../utils/multerConfig.js";
import { usersLimiter } from "../middlewares/rateLimiter.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

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
//admin.login
authRouter.post(
  "/admin/login",
  
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  adLogin
);

// 2FA Verification Route
authRouter.post(
  '/verify-2fa',
  [
    body('tempToken').notEmpty(),
    body('code').isLength({ min: 6, max: 6 })
  ],
  verify2FA
);





authRouter.post(
  "/logout",
  
  logout
);
//admin route (logout)
authRouter.post(
  "/admin/logout",
  
  adLogout
);

authRouter.get("/profile", authenticateToken, profile)

//admin route
authRouter.get("/admin/profile", authenticateAdminToken, profile)



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


authRouter.put(
  "/edit/admin/profile",
  authenticateAdminToken,
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

//admin route
authRouter.get(
  '/users/all',
  usersLimiter, 
  authenticateAdminToken,
  isAdmin,
  check('page').optional().isInt({ min: 1 }),
  check('limit').optional().isInt({ min: 1, max: 100 }),
  getAllUsers
);