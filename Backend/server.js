import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";



dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

// Static directories for serving images
app.use("/uploads/product-image", express.static("uploads/product-image"));
app.use("/uploads/display-image", express.static("uploads/display-image"));
app.use("/uploads/userImages", express.static("uploads/userImages"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Create HTTP server and integrate with socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
});

// Make socket.io instance available in routes via the Express app instance.
app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a conversation room.
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });


  
  // Handler for typing events
  socket.on("typing", (data) => {
    // Expected data: { conversationId, isTyping }
    const { conversationId, isTyping } = data;
    if (conversationId) {
      // Broadcast typing status to all clients in the room except the sender
      socket.to(conversationId).emit("typing", { conversationId, isTyping });
    }
  });


  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
