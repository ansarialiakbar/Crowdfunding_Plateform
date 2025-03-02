import { useContext } from "react";
import { CampaignContext } from "../context/CampaignContext";

const useCampaignData = () => {
  const { campaigns, loading, error, refreshCampaigns } = useContext(CampaignContext);
  return { campaigns, loading, error, refreshCampaigns };
};

export default useCampaignData;
