import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X, UserCircle, ChevronDown, MessageCircle } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || "guest";
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Handle user logout and redirect to home
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <UserCircle size={28} /> CrowdFund
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/campaigns" className="hover:underline transition">Explore</Link>
          <ScrollLink to="categories" smooth={true} duration={500} className="hover:underline cursor-pointer transition">Categories</ScrollLink>
          <ScrollLink to="how-it-works" smooth={true} duration={500} className="hover:underline cursor-pointer transition">How It Works</ScrollLink>
          {user && (
            <Link to="/chat" className="hover:underline transition flex items-center gap-1">
              <MessageCircle size={20} /> Chat
            </Link>
          )}
        </div>

        {/* User Profile & Authentication Dropdown */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition"
              >
                {user.name} <ChevronDown className="ml-2" size={18} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-md rounded-lg overflow-hidden z-50 border">
                  <p className="px-4 py-2 text-gray-700 font-semibold">Role: {userRole}</p>
                  <Link to="/profile" className="block px-4 py-3 hover:bg-gray-200 transition">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 hover:bg-gray-200 transition">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Login / Sign Up <ChevronDown className="ml-2" size={18} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-md rounded-lg overflow-hidden z-50 border">
                  <p className="px-4 py-2 text-gray-700 font-semibold">Role: Guest</p>
                  <Link to="/signup" className="block px-4 py-3 hover:bg-gray-200 transition">Sign Up</Link>
                  <Link to="/login" className="block px-4 py-3 hover:bg-gray-200 transition">Login</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden block focus:outline-none">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-lg">
          <Link to="/campaigns" className="block py-2 hover:underline transition">Explore</Link>
          <ScrollLink to="categories" smooth={true} duration={500} className="block py-2 hover:underline cursor-pointer transition">Categories</ScrollLink>
          <ScrollLink to="how-it-works" smooth={true} duration={500} className="block py-2 hover:underline cursor-pointer transition">How It Works</ScrollLink>
          {user && (
            <Link to="/chat" className="block py-2 hover:underline transition flex items-center gap-1">
              <MessageCircle size={20} /> Chat
            </Link>
          )}

          {/* Mobile Authentication Options */}
          {user ? (
            <div className="mt-4">
              <p className="px-4 py-2 text-gray-300">Role: {userRole}</p>
              <Link to="/profile" className="block px-4 py-3 hover:bg-gray-600 transition">Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-3 hover:bg-gray-600 transition">Logout</button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="px-4 py-2 text-gray-300">Role: Guest</p>
              <Link to="/signup" className="block px-4 py-3 hover:bg-gray-600 transition">Sign Up</Link>
              <Link to="/login" className="block px-4 py-3 hover:bg-gray-600 transition">Login</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
