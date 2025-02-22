// src/services/chatService.js
import io from "socket.io-client";

let socket;

try {
  socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 3,
    reconnectionDelay: 5000,
  });

  socket.on("connect_error", () => {
    console.warn("Socket connection failed, backend might be down.");
    socket.disconnect();
  });
} catch (error) {
  console.error("Socket.io error:", error);
}

export const sendMessage = (message) => {
  if (socket?.connected) {
    socket.emit("message", message);
  } else {
    console.warn("Message not sent: No connection to server.");
  }
};

export const receiveMessages = (callback) => {
  if (socket) {
    socket.on("message", callback);
  }
};
