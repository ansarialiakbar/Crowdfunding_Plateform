// src/services/chatService.js
import { io } from "socket.io-client";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const SOCKET_URL = API_BASE_URL; // ✅ Ensure WebSocket and API are the same

let socket;

try {
  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  });

  socket.on("connect_error", () => {
    console.warn("⚠️ Socket connection failed. Retrying...");
  });
} catch (error) {
  console.error("❌ Socket.io error:", error);
}

// ✅ Send a new chat message
export const sendMessage = async ({ sender, receiver, message }) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/chat/send`, { sender, receiver, message });
    return res.data;
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
};

// ✅ Listen for incoming messages
export const receiveMessages = (callback) => {
  if (socket) {
    socket.off("receiveMessage"); // ✅ Ensure no duplicate listeners
    socket.on("receiveMessage", callback);
  }
};

// ✅ Send typing event
export const sendTyping = (isTyping) => {
  socket.emit("typing", isTyping);
};

// ✅ Listen for typing status
export const receiveTyping = (callback) => {
  if (socket) {
    socket.off("userTyping");
    socket.on("userTyping", callback);
  }
};

// ✅ Fetch chat history (last 50 messages)
export const fetchChatHistory = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/chat/messages/${userId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    return [];
  }
};

// ✅ Mark messages as read
export const markMessagesAsRead = (userId) => {
  socket.emit("markAsRead", userId);
};

// ✅ Fetch Users for Private Messaging
export const getUsers = async (authToken) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return [];
  }
};

// ✅ Disconnect Socket When Component Unmounts
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("🔌 Socket disconnected");
  }
};
