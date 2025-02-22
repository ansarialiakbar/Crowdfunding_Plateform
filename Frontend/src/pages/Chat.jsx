// src/pages/Chat.jsx
import { useEffect, useState } from "react";
import { sendMessage, receiveMessages } from "../services/chatService";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    receiveMessages((msg) => setMessages((prev) => [...prev, msg]));
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-3">Live Chat</h2>
      <div className="h-64 bg-gray-200 p-3 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg, i) => (
            <p key={i} className="p-2 bg-white shadow rounded mb-1">{msg}</p>
          ))
        )}
      </div>
      <input
        type="text"
        className="border p-2 w-full mt-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        className="bg-blue-500 text-white p-2 mt-2 w-full"
        onClick={() => {
          if (message.trim()) {
            sendMessage(message);
            setMessage("");
          }
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
