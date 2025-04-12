// src/pages/Chat.jsx
import { useEffect, useState, useRef } from "react";
import { sendMessage, receiveMessages, sendTyping, receiveTyping, fetchChatHistory, markMessagesAsRead, getUsers } from "../services/chatService";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [receiver, setReceiver] = useState("");
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // ✅ Load Users for Chat Selection
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      const usersList = await getUsers(token);
      setUsers(usersList);
    };
    fetchUsers();
  }, [token]);

  // ✅ Load Chat History for Selected User
  useEffect(() => {
    if (!user || !receiver) return;

    const loadMessages = async () => {
      const chatHistory = await fetchChatHistory(user._id, receiver);
      setMessages(chatHistory);
      await markMessagesAsRead(user._id, receiver);
    };

    loadMessages();
  }, [user, receiver]);

  // ✅ Listen for incoming messages & typing events
  useEffect(() => {
    receiveMessages((msg) => {
      setMessages((prev) => [...prev, msg]);
      // ✅ If this message is sent to current user from the active chat, mark it seen
      if (msg.receiver === user?._id && msg.sender === receiver) {
         markMessagesAsRead(user._id, receiver);
      }
    });

    receiveTyping((isTyping) => {
      setTyping(isTyping);
    });

    return () => console.log("🔌 Disconnected from chat");
  }, []);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Handle user typing
  const handleTyping = () => {
    sendTyping(receiver, true);
    setTimeout(() => sendTyping(receiver, false), 2000);
  };

  // ✅ Handle send message
  const handleSend = async () => {
    if (!user || !user._id || !receiver.trim() || !message.trim()) {
      console.warn("⚠️ Missing sender, receiver, or message.");
      console.log("🔍 Debugging:", { sender: user?._id, receiver, message });
      return;
    }

    const newMessage = await sendMessage({ sender: user._id, receiver, message, seen: false });
    if (newMessage) {
         // ✅ Show immediately on sender UI
    setMessages((prev) => [...prev, newMessage]);

    // ✅ Emit message over WebSocket to send it in real-time
    socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-3 text-center text-blue-600">💬 Live Chat</h2>

      {/* ✅ Select Receiver */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Select User to Chat:</label>
        <select
          className="border p-2 w-full rounded-lg shadow-sm focus:ring focus:ring-blue-300 transition duration-200"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        >
          <option value="">🔽 Select a user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Chat Messages */}
      <div className="h-72 bg-white p-3 overflow-y-auto rounded-lg shadow-inner border">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}>
            <p
              className={`p-2 rounded-lg text-sm shadow-md transition-all ${
                msg.sender === user._id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
            >
              <strong>{msg.sender === user._id ? "You" : users.find(u => u._id === msg.sender)?.name || msg.sender}:</strong> {msg.message}{" "}
              {msg.seen && <span className="text-green-600 text-xs">✔✔</span>}
            </p>
          </div>
        ))}
        {typing && <p className="text-gray-500 italic text-sm animate-pulse">Someone is typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      {/* ✅ Input for sending messages */}
      <div className="flex mt-3">
        <input
          type="text"
          className="border p-2 w-full rounded-lg shadow-md focus:ring focus:ring-blue-300 transition duration-200"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="✍️ Type a message..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 ml-2 rounded-lg shadow-md transition duration-200"
          onClick={handleSend}
        >
          🚀 Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
