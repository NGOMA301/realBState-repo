import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    phoneNumber: Number,
    address: {
      city: String,
      street: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    profileImage: String,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
