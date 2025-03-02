import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Footer = () => {
  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(""); // Reset response message

    try {
      const res = await axios.post(`${API_BASE_URL}/api/contact/submit`, contactData);
      setResponseMessage("✅ Message sent successfully!");
      setContactData({ name: "", email: "", message: "" }); // Clear form
    } catch (error) {
      console.error("❌ Contact form error:", error);
      setResponseMessage("❌ Failed to send message. Please try again.");
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p className="mt-2">📧 Email: support@example.com</p>
            <p>📞 Phone: +1 234 567 890</p>
            <p>📍 Address: 1234 Street, City, Country</p>
          </div>

          {/* Quick Contact Form */}
          <div>
            <h2 className="text-xl font-semibold">Quick Contact</h2>
            <form onSubmit={handleSubmit} className="mt-2 space-y-2">
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none" 
                value={contactData.name} 
                onChange={handleChange} 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email" 
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none" 
                value={contactData.email} 
                onChange={handleChange} 
              />
              <textarea 
                name="message"
                placeholder="Your Message" 
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none" 
                value={contactData.message} 
                onChange={handleChange} 
              />
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
                Send Message
              </button>
            </form>
            {responseMessage && <p className="text-sm mt-2">{responseMessage}</p>}
          </div>

          {/* Social Media Links */}
          <div>
            <h2 className="text-xl font-semibold">Follow Us</h2>
            <div className="flex justify-center md:justify-start space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition"><i className="fab fa-facebook-f text-2xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition"><i className="fab fa-twitter text-2xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition"><i className="fab fa-youtube text-2xl"></i></a>
              <a href="https://www.linkedin.com/in/aliakbarfullstack" className="text-gray-400 hover:text-blue-700 transition"><i className="fab fa-linkedin-in text-2xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition"><i className="fab fa-instagram text-2xl"></i></a>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-4">
          <p>© 2025 CrowdFund. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
