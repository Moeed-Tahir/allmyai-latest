// models/Email.js
import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: "waitlist",
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

// Create index for better performance
EmailSchema.index({ email: 1 });
EmailSchema.index({ createdAt: -1 });

export default mongoose.models.Email || mongoose.model("Email", EmailSchema);