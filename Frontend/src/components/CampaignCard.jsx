import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react"; // ❤️ Icons for saving campaigns
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CampaignCard = ({ campaign }) => {
  const { user, token, fetchSavedCampaigns, savedCampaigns } = useAuth();
  const [saved, setSaved] = useState(false);

  // ✅ Ensure `savedCampaigns` is an array before accessing `.some()`
  useEffect(() => {
    if (Array.isArray(savedCampaigns) && savedCampaigns.some((c) => c._id === campaign._id)) {
      setSaved(true);
    }
  }, [savedCampaigns, campaign._id]);

  // ✅ Toggle Save/Unsave Campaign
  const handleSaveToggle = async () => {
    if (!user) {
      alert("Please log in to save campaigns.");
      return;
    }

    try {
      let endpoint = `${API_BASE_URL}/api/users/${user._id}/save-campaign`;
      let method = "POST";

      if (saved) {
        endpoint = `${API_BASE_URL}/api/users/${user._id}/unsave-campaign`;
        method = "DELETE";
      }

      const res = await axios({
        method,
        url: endpoint,
        data: { campaignId: campaign._id },
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchSavedCampaigns(user._id);
      setSaved(!saved);
      alert(res.data.message);
    } catch (error) {
      console.error("❌ Error saving campaign:", error);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white relative transition-transform transform hover:scale-105 duration-300">
      {/* ❤️ Save Button */}
      <button
        onClick={handleSaveToggle}
        className={`absolute top-3 right-3 transition duration-300 ${
          saved ? "text-red-700" : "text-gray-500"
        } hover:text-red-700`}
      >
        {saved ? <HeartOff size={22} /> : <Heart size={22} />}
      </button>

      {/* Campaign Image */}
      <img
        src={campaign.image}
        alt={campaign.title}
        className="h-40 w-full object-cover rounded-md shadow"
      />

      {/* Campaign Details */}
      <h3 className="text-lg font-bold mt-2 text-gray-800">{campaign.title}</h3>
      <p className="text-gray-600">{campaign.description.substring(0, 100)}...</p>

      <div className="mt-3 flex justify-between items-center">
        <p className="text-green-600 font-bold">
          ${campaign.raised} / ${campaign.goal}
        </p>
        <Link
          to={`/campaigns/${campaign._id}`}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
