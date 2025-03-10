import express from "express";
import mongoose from 'mongoose'
import Message from "../models/Message.js";
import {
  authenticateAdminToken,
  authenticateUserOrAdmin,
} from "../middlewares/auth.middleware.js";
import { Product } from "../models/product.model.js";
export const adRouter = express.Router();

// Send message (User)
adRouter.post("/send/messages", authenticateUserOrAdmin, async (req, res) => {
  try {
    const { productId, message, receiverId } = req.body;

    const newMessage = new Message({
      sender: req.userId,
      receiver: receiverId, // Admin ID
      product: productId,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


// Get conversation (Both users and admins)
// adRouter.get(
//   "/conversation/:productId",
//   authenticateUserOrAdmin,
//   async (req, res) => {
//     try {
//       const { productId } = req.params;
//       const userId = req.userId;

//       // Get product with owner information
//       const product = await Product.findById(productId)
//         .populate('createdBy', 'name email _id')
//         .lean();

//       if (!product) {
//         return res.status(404).json({ error: "Product not found" });
//       }

//       const productOwnerId = product.createdBy._id;
//       const isProductOwner = productOwnerId.toString() === userId;

//       let messages;

//       if (isProductOwner) {
//         // Product owner gets all messages for the product
//         messages = await Message.find({ product: productId })
//           .populate("sender", "name email")
//           .populate("receiver", "name email")
//           .populate({
//             path: "product",
//             select: "title price createdBy",
//             populate: {
//               path: "createdBy",
//               select: "name email"
//             }
//           })
//           .sort("createdAt")
//           .lean();
//       } else {
//         // Regular user gets messages between them and the product owner
//         const userIdObj = new mongoose.Types.ObjectId(userId);
//         messages = await Message.find({
//           product: productId,
//           $or: [
//             { sender: userIdObj, receiver: productOwnerId },
//             { sender: productOwnerId, receiver: userIdObj }
//           ]
//         })
//           .populate("sender", "name email")
//           .populate("receiver", "name email")
//           .populate({
//             path: "product",
//             select: "title price createdBy",
//             populate: {
//               path: "createdBy",
//               select: "name email"
//             }
//           })
//           .sort("createdAt")
//           .lean();
//       }

//       const response = {
//         product: {
//           id: product._id,
//           title: product.title,
//           price: product.price,
//           owner: product.createdBy
//         },
//         participants: {
//           user: userId,
//           admin: productOwnerId
//         },
//         messages
//       };

//       res.json(response);
//     } catch (error) {
//       console.error("Conversation error:", error);
//       res.status(500).json({ 
//         error: "Failed to fetch conversation",
//         details: error.message 
//       });
//     }
//   }
// );

//gpt cd
adRouter.get("/conversation/:productId/:partnerId?", authenticateUserOrAdmin, async (req, res) => {
  try {
    const { productId, partnerId } = req.params;
    const userId = req.userId;

    // Get product with owner information
    const product = await Product.findById(productId)
      .populate("createdBy", "name email _id")
      .lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productOwnerId = product.createdBy._id.toString();
    const isProductOwner = productOwnerId === userId;

    let messages;

    if (isProductOwner) {
      if (partnerId) {
        // If partnerId is provided, return messages only between the product owner and that partner.
        const partnerIdObj = new mongoose.Types.ObjectId(partnerId);
        messages = await Message.find({
          product: productId,
          $or: [
            { sender: partnerIdObj, receiver: userId },
            { sender: userId, receiver: partnerIdObj }
          ]
        })
          .populate("sender", "name email")
          .populate("receiver", "name email")
          .sort("createdAt")
          .lean();
      } else {
        // If no partnerId is provided, return all messages for the product.
        messages = await Message.find({ product: productId })
          .populate("sender", "name email")
          .populate("receiver", "name email")
          .sort("createdAt")
          .lean();
      }
    } else {
      // Regular users only see their conversation with the product owner.
      const userIdObj = new mongoose.Types.ObjectId(userId);
      messages = await Message.find({
        product: productId,
        $or: [
          { sender: userIdObj, receiver: productOwnerId },
          { sender: productOwnerId, receiver: userIdObj }
        ]
      })
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .sort("createdAt")
        .lean();
    }

    return res.json({
      product: {
        id: product._id,
        title: product.title,
        price: product.price,
        owner: product.createdBy
      },
      messages
    });
  } catch (error) {
    console.error("Conversation error:", error);
    res.status(500).json({ 
      error: "Failed to fetch conversation",
      details: error.message 
    });
  }
});






// Get all messages sent to the product owner (Admin only)
adRouter.get("/messages/admin", authenticateAdminToken, async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Find all products owned by this admin
    const ownedProducts = await Product.find({ createdBy: req.userId }).select(
      "_id"
    );

    if (ownedProducts.length === 0) {
      return res.json([]); // No messages if no products exist
    }

    const productIds = ownedProducts.map((product) => product._id); // Extract product IDs

    // Find all messages where:
    // - The product is owned by the logged-in admin
    // - The admin is the receiver
    const messages = await Message.find({
      product: { $in: productIds }, // Messages related to admin's products
      receiver: req.userId, // Admin is the receiver
    })
      .populate("sender", "name email") // Show who sent the message
      .populate("product", "title price") // Show product details
      .sort("-createdAt"); // Sort by latest messages first

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
