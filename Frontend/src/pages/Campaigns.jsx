// pages/Campaign.jsx
import { useState, useEffect } from "react";
import CampaignCard from "../components/CampaignCard";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">Campaigns</h2>
      <div className="grid grid-cols-3 gap-6 mt-4">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
