// src/server.js
import dotenv from "dotenv";
dotenv.config(); // ✅ Ensure environment variables are loaded first

import http from "http";
import { Server as SocketIO } from "socket.io";
import { app } from "./app.js";
import connectDB from "./config/db.js";
import Chat from "./models/Chat.js"; // ✅ Import Chat Model

// Connect to MongoDB
connectDB();

// Define Port
const PORT = process.env.PORT || 5000;

// Create HTTP Server (Ensuring WebSockets Work)
const server = http.createServer(app);

// Initialize WebSocket
const io = new SocketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Handle WebSocket Connections
io.on("connection", (socket) => {
  console.log(`✅ WebSocket connected: ${socket.id}`);

  // Handle Incoming Messages
  socket.on("sendMessage", async (message) => {
    console.log("📩 Message received:", message);

    // ✅ Store Message in MongoDB
    try {
      const savedMessage = await Chat.create({
        sender: message.sender,
        message: message.message,
      });

      console.log("✅ Message Stored in DB:", savedMessage);

      // ✅ Emit Only Stored Message to Prevent Duplicates
      io.emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("❌ Error Saving Message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Start the Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🔍 Checking Environment Variables in server.js:");
  console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ Missing");
  console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY || "❌ Missing");
  console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌");
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("❌ Server shutting down...");
  await connectDB().disconnect();
  process.exit(0);
});
