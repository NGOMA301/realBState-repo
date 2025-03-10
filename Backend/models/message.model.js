import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assumes you have a User model defined
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    // Optionally, store file paths or URLs for any attachments sent with the message
    attachments: [
      {
        type: String,
      },
    ],
    // Tracks which users have read this message
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
