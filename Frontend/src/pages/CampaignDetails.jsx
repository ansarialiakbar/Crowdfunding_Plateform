// src/pages/CampaignDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    axios.get(`/api/campaigns/${id}`).then((res) => setCampaign(res.data));
  }, [id]);

  if (!campaign) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">{campaign.title}</h2>
      <img src={campaign.image} alt={campaign.title} className="w-full h-60 object-cover rounded" />
      <p className="mt-4">{campaign.description}</p>
      <p className="mt-2 font-bold">Category: {campaign.category}</p>
      <p className="mt-2 font-bold">Funding Goal: ${campaign.goal}</p>
      <p className="mt-2 font-bold">Funds Raised: ${campaign.raised}</p>
      <p className="mt-2 font-bold">Number of Backers: {campaign.backers}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded mt-4">
        <div
          className="bg-green-500 h-6 rounded"
          style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CampaignDetails;
