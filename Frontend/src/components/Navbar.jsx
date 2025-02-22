// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || "guest"; // Possible roles: 'creator', 'backer', 'admin'

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">CrowdFund</Link>

      <div className="space-x-4">
        <Link to="/campaigns" className="hover:underline">Explore</Link>
        <Link to="/categories" className="hover:underline">Categories</Link>
        <Link to="/about" className="hover:underline">How It Works</Link>
      </div>

      <div className="space-x-4">
        {user ? (
          <div className="relative group">
            <button className="bg-gray-800 px-4 py-2 rounded-full">{user.name}</button>
            <div className="absolute right-0 mt-2 bg-white text-black shadow-md rounded hidden group-hover:block">
              {userRole === "creator" && <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">My Campaigns</Link>}
              {userRole === "backer" && <Link to="/saved" className="block px-4 py-2 hover:bg-gray-200">Saved Campaigns</Link>}
              {userRole === "admin" && <Link to="/admin" className="block px-4 py-2 hover:bg-gray-200">Admin Dashboard</Link>}
              <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="bg-green-500 px-4 py-2 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
