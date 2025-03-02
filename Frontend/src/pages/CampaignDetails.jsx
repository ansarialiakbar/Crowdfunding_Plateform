import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import usePayments from "../hooks/usePayments";
import { useAuth } from "../context/AuthContext"; // ✅ Correct import

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handlePayment } = usePayments();
  const { user, token, fetchUserDonations } = useAuth();// ✅ Get user details correctly

  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  // ✅ Fetch campaign details from API
  const fetchCampaign = async () => {
    if (!id) {
      setError("Invalid campaign ID.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/campaigns/${id}`);
      if (!res.data || res.data.error) {
        throw new Error("Campaign not found.");
      }
      setCampaign({
        ...res.data,
        backers: res.data.backers || 0,
      });
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching campaign details:", err);
      setError("Campaign not found or an error occurred.");
      setLoading(false);
    }
  };

  // ✅ Handle donation & update state
  const handleDonate = async () => {
    if (!donationAmount || donationAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
        // Get token and user from AuthContext
    
    if (!user || !token) {
      alert("You need to be logged in to donate.");
      return;
    }
      const paymentSuccess = await handlePayment(donationAmount, id);

      if (paymentSuccess) {
        alert("🎉 Donation successful!");
        // ✅ Make API call to save the donation
      await axios.post(
        `${API_BASE_URL}/api/donations`,
        {
          userId: user._id, // Ensure correct userId is sent
          campaignId: id,
          amount: donationAmount,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent
        }
      );
        
        // ✅ Fetch latest campaign data after donation
        const updatedData = await axios.get(`${API_BASE_URL}/api/campaigns/${id}`);
        
        // ✅ Ensure backers count updates properly
        setCampaign({
          ...updatedData.data,
          backers: updatedData.data.backers || campaign.backers + 1,
        });
         // ✅ Refetch user donations
        fetchUserDonations(user._id, token);

        setIsModalOpen(false);
      } else {
        alert("Payment failed.");
      }
    } catch (error) {
      console.error("❌ Donation Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading campaign details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!campaign) return <p className="text-center text-gray-500">Campaign not found.</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
        <img src={campaign.image} alt={campaign.title} className="w-full h-64 object-cover rounded-lg shadow-md" />

        <div className="mt-6">
          <h2 className="text-3xl font-bold text-gray-800">{campaign.title}</h2>
          <p className="text-gray-600 mt-3">{campaign.description}</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <p>📌 Category: {campaign.category}</p>
            <p>🎯 Goal: ${campaign.goal}</p>
            <p>💰 Funds Raised: <span className="text-green-600">${campaign.raised}</span></p>
            <p>👥 Backers: <span className="text-gray-900">{campaign.backers || 0}</span></p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-5 mt-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
              style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
            ></div>
          </div>

          {/* Donate Button */}
          <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-green-500 text-white py-2 px-4 rounded">
            Donate Now
          </button>

          {/* Donation Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Donate to Campaign">
            <input
              type="number"
              placeholder="Enter donation amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="border p-2 w-full my-2"
            />
            <button onClick={handleDonate} className="bg-blue-500 text-white px-4 py-2 rounded">
              Proceed to Payment
            </button>
          </Modal>

          {/* Back Button */}
          <button onClick={() => navigate("/campaigns")} className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg">
            ← Back to Campaigns
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
