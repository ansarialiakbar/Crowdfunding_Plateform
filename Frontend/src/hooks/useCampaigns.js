// useCampaigns.js - Hook for campaign management
import { useCampaigns } from "../context/CampaignContext";

const useCampaigns = () => {
  const { campaigns } = useCampaigns();
  return campaigns;
};

export default useCampaigns;
