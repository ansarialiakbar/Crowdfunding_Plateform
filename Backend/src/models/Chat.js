// src/models/Chat.js
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true }, // ✅ Add receiver
    message: { type: String, required: true },
    seen: { type: Boolean, default: false } // ✅ Track read status
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
