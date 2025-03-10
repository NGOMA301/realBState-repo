import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assumes you have a User model defined
        required: true,
      },

    ],
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null,
      },
    // Optionally, store the text of the last message to display in conversation previews
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.model("Conversation", conversationSchema);
