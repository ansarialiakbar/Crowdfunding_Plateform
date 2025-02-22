import { Link } from "react-router-dom";

const CampaignCard = ({ campaign }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <img src={campaign.image} alt={campaign.title} className="h-40 w-full object-cover rounded-md" />
      <h3 className="text-lg font-bold mt-2">{campaign.title}</h3>
      <p className="text-gray-600">{campaign.description.substring(0, 100)}...</p>
      <div className="mt-3 flex justify-between items-center">
        <p className="text-green-600 font-bold">${campaign.raised} / ${campaign.goal}</p>
        <Link to={`/campaigns/${campaign.id}`} className="bg-blue-500 text-white px-3 py-1 rounded">
          View
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
