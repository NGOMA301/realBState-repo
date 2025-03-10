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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastAccessedAt: Date,
    active: {
      type: Boolean,
      default: true,
    },
    twoFactorCode: String,
    twoFactorExpires: Date,
    is2FAVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
