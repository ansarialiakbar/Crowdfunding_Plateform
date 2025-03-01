// src/routes/chatRoutes.js
import express from "express";
import { sendMessage, getMessages, markMessagesAsRead } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Send a Message (Supports Private Messaging)
router.post("/send", authMiddleware, sendMessage);

// ✅ Get Last 50 Messages (Requires userId in params)
router.get("/messages/:userId", authMiddleware, getMessages);

// ✅ Mark Messages as Read (✔✔ Seen)
router.put("/messages/read/:userId", authMiddleware, markMessagesAsRead);

export default router;
