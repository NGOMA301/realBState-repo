//modules import 
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
//import path from "path";



//local import
import { authRouter } from "./routes/authRoutes.js";
import { productRouter } from "./routes/productRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // Replace with your frontend URL
  credentials: true // Allow credentials (cookies)
}));

// Use cookie-parser middleware
app.use(cookieParser());



// Static directories for serving images
app.use("/uploads/product-image", express.static("uploads/product-image"));
app.use("/uploads/display-image", express.static("uploads/display-image"));
app.use("/uploads/userImages", express.static("uploads/userImages"));


//MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


//routes for Auth
app.use("/api",authRouter)
app.use("/api/product", productRouter)

//port
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(`server listening on http://localhost:${PORT}`)
);
