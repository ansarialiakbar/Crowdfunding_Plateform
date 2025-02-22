// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center text-gray-600">Loading...</p>; // ✅ Show loading text
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <p>Welcome, {user?.name}!</p>

      {user?.role === "creator" && (
        <div className="mt-5">
          <Link to="/create" className=" bg-blue-500 text-white p-3 rounded mt-4 mr-2">Create Campaign</Link>
          <Link to="/my-campaigns" className=" bg-gray-500 text-white p-3 rounded mt-2">My Campaigns</Link>
        </div>
      )}

      {user?.role === "backer" && (
        <div>
          <Link to="/saved" className="block bg-green-500 text-white p-3 rounded mt-4">Saved Campaigns</Link>
        </div>
      )}

      {user?.role === "admin" && (
        <div>
          <Link to="/admin" className="block bg-red-500 text-white p-3 rounded mt-4">Admin Panel</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
