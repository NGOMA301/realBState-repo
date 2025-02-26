import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// Import controllers
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  addToWishlist,
  removeFromWishlist,
  getAllWishlist,
} from "../controlers/product.controler.js";
import { authenticate, authenticateToken } from "../middlewares/auth.middleware.js";

export const productRouter = express.Router();

// Create directories if they don't exist
const productImageDir = "./uploads/product-image";
const displayImageDir = "./uploads/display-image";
if (!fs.existsSync(productImageDir))
  fs.mkdirSync(productImageDir, { recursive: true });
if (!fs.existsSync(displayImageDir))
  fs.mkdirSync(displayImageDir, { recursive: true });

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isDisplayImage = file.fieldname === "displayImage";
    const isNewImage = file.fieldname === "newImages";
    const dir = isDisplayImage
      ? displayImageDir
      : isNewImage
      ? productImageDir // Store newImages in product-images directory
      : productImageDir;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// Product creation route
productRouter.post(
  "/new",
  upload.fields([
    { name: "displayImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createProduct
);

//update product
productRouter.put(
  "/update/:id",
  upload.fields([
    { name: "displayImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "newImages", maxCount: 10 },
  ]),
  updateProduct
);

//get all products
productRouter.get("/all", getAllProducts);

//get single product
productRouter.get("/single/:id", getProductById);
productRouter.delete("/delete/:id", deleteProduct);
productRouter.get("/details/:slug", getProductBySlug);

//wishlist

// Add to wishlist
productRouter.post("/wishlist/add-to-wishlist", authenticate, addToWishlist);

// Remove from wishlist
productRouter.delete("/wishlist/remove/:productId", authenticate, removeFromWishlist);

// Get user's wishlist
productRouter.get("/wishlist/all", authenticate, getAllWishlist);