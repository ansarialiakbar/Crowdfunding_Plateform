import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ✅ Icon for back button

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <p className="text-center text-gray-600 text-lg">Loading your dashboard...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        {/* 🔙 Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition duration-300 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </button>

        {/* 🏠 Dashboard Title */}
        <h2 className="text-3xl font-bold text-gray-800 text-center">Dashboard</h2>
        <p className="text-center text-gray-600 mt-2">Welcome, <span className="text-blue-600 font-semibold">{user?.name}</span>!</p>

        {/* 👤 Role-Based Sections */}
        <div className="mt-6 space-y-4">
          {/* Creator Section */}
          {user?.role === "creator" && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">🚀 Creator Tools</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/create" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
                  ✨ Create Campaign
                </Link>
                {/* <Link to="/my-campaigns" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
                  📁 My Campaigns
                </Link> */}
              </div>
            </div>
          )}

          {/* Backer Section */}
          {user?.role === "backer" && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">💖 Backer Features</h3>
              <Link to="/saved" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
                📌 Saved Campaigns
              </Link>
            </div>
          )}

          {/* Admin Section */}
          {user?.role === "admin" && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">🛠️ Admin Controls</h3>
              <Link to="/admin" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
                ⚙️ Admin Panel
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
