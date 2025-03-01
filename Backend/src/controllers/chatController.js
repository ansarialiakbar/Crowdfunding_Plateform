// src/controllers/chatController.js
import Chat from "../models/Chat.js";

// ✅ Send a Message (Supports Private Messages)
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // ✅ Ensure required fields
    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "Sender, receiver, and message are required" });
    }

    console.log("📩 Storing message:", { sender, receiver, message });

    // ✅ Save message to MongoDB
    const chatMessage = await Chat.create({ sender, receiver, message, seen: false });

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error("❌ Error storing message:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Last 50 Messages (Chat History)
export const getMessages = async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await Chat.find({ $or: [{ sender: userId }, { receiver: userId }] })
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mark Messages as Read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Chat.updateMany({ receiver: userId, seen: false }, { $set: { seen: true } });

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("❌ Error marking messages as read:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Handle Typing Indicator
export const userTyping = (socket, isTyping) => {
  socket.broadcast.emit("userTyping", isTyping);
};
