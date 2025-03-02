import { useState, useEffect } from "react";
import CampaignCard from "../components/CampaignCard";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SavedCampaigns = () => {
  const { user, token, savedCampaigns, fetchSavedCampaigns } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      console.log("📢 Fetching saved campaigns for user:", user._id);

      fetchSavedCampaigns(user._id)
        .then((data) => {
          if (Array.isArray(data)) {
            setCampaigns(data);
            console.log("✅ Updated Campaigns State:", data);
          } else {
            console.error("❌ Data fetched is not an array:", data);
            setCampaigns([]);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching saved campaigns:", err);
          setError("Failed to load saved campaigns.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // ✅ Remove campaign from saved list
  const handleUnsave = async (campaignId) => {
    if (!user) {
      alert("Please log in to remove saved campaigns.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/users/${user._id}/save-campaign`,
        { campaignId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchSavedCampaigns(user._id)
        .then((data) => setCampaigns(data || []))
        .catch((err) => console.error("❌ Error refreshing saved campaigns:", err));

      alert("Campaign removed successfully.");
    } catch (error) {
      console.error("❌ Error unsaving campaign:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition duration-300 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold text-center">❤️ Saved Campaigns</h2>

        {loading ? (
          <p className="text-center text-gray-500 mt-4">Loading saved campaigns...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-4">{error}</p>
        ) : campaigns.length === 0 ? (
          <p className="text-center text-gray-600 mt-4">No saved campaigns yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="relative">
                <CampaignCard campaign={campaign} />
                <button
                  onClick={() => handleUnsave(campaign._id)}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm shadow-md transition duration-300"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCampaigns;
