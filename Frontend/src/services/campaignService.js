import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // ✅ Fix API URL

export const getAllCampaigns = async () => {
  try {
    console.log("📢 Fetching campaigns from:", `${API_BASE_URL}/api/campaigns`); // Debug URL
    const res = await axios.get(`${API_BASE_URL}/api/campaigns`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching campaigns:", error.response?.data || error.message);
    return [];
  }
};

export const createCampaign = async (formData, token) => {
  try {
    if (!token) {
      console.error("❌ No token provided for campaign creation.");
      return null;
    }

    const res = await axios.post(`${API_BASE_URL}/api/campaigns`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Campaign Created:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error creating campaign:", error.response?.data || error.message);
    return null;
  }
};
