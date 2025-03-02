import { createContext, useContext, useState, useEffect } from "react";
import { getAllCampaigns } from "../services/campaignService";

export const CampaignContext = createContext(); // ✅ Export Context

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError("Failed to load campaigns. Please try again.");
      console.error("❌ Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <CampaignContext.Provider value={{ campaigns, loading, error, refreshCampaigns: fetchCampaigns }}>
      {children}
    </CampaignContext.Provider>
  );
};

// ✅ Export Hook for accessing campaign data
export const useCampaigns = () => useContext(CampaignContext);
