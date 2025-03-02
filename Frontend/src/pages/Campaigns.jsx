import { useState, useEffect } from "react";
import CampaignCard from "../components/CampaignCard";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ Use environment variable

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/campaigns`)
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setCampaigns(res.data);
        } else {
          throw new Error("Invalid API response format");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-center">Campaigns</h2>

      {loading && <p>Loading campaigns...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-3 gap-6 mt-4">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))
        ) : (
          !loading && <p>No campaigns available.</p>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
