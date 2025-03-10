import express from "express";
import {
  startConversation,
  sendMessage,
  getConversations,
  getMessages,
  getUnreadMessages,
  markAsRead,
} from "../controlers/chat.controller.js";
import { authenticateToken, authenticateAdminToken } from "../middlewares/auth.middleware.js";
import conversationModel from "../models/conversation.model.js";

export const chatRouter = express.Router();

// Start a new conversation (or return an existing one)
chatRouter.post("/conversation", authenticateToken, startConversation);

// Send a new message
chatRouter.post("/message", authenticateToken, sendMessage);




// Get all conversations for the authenticated user
chatRouter.get("/conversations", authenticateToken, getConversations);


// Get all messages for a specific conversation
chatRouter.get(
  "/messages/:conversationId",
  authenticateToken,
  getMessages
);




// Get unread messages for the authenticated user
chatRouter.get("/unread", authenticateToken, getUnreadMessages);

// Mark messages in a conversation as read
chatRouter.post("/mark-as-read", authenticateToken, markAsRead);



// Get single conversation details
chatRouter.get("/conversation/:id", authenticateToken, async (req, res) => {
    try {
        const conversation = await conversationModel.findById(req.params.id)
        .populate('product', 'title price displayImage')
        .populate('participants', 'name profileImage');
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });







  //////////////////////////
  //for admin

  // Start a new conversation (or return an existing one) admin
chatRouter.post("/admin/conversation", authenticateAdminToken, startConversation);

// Send a new message admin
chatRouter.post("/admin/message", authenticateAdminToken, sendMessage);

// Get all conversations for the authenticated admin
chatRouter.get("/admin/conversations", authenticateAdminToken, getConversations);

// Get all messages for a specific conversation admin
chatRouter.get(
  "/admin/messages/:conversationId",
  authenticateToken,
  getMessages
);


// Get unread messages for the authenticated admin
chatRouter.get("/admin/unread", authenticateAdminToken, getUnreadMessages);

// Mark messages in a conversation as read admin
chatRouter.post("/admin/mark-as-read", authenticateAdminToken, markAsRead);


// Get single conversation details admin
chatRouter.get("/admin/conversation/:id", authenticateAdminToken, async (req, res) => {
    try {
      const conversation = await conversationModel.findById(req.params.id)
        .populate('product', 'title price displayImage')
        .populate('participants', 'name profileImage');
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
