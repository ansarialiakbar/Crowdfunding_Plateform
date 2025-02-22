import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllCampaigns = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/campaigns`);
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

    const res = await axios.post(`${API_BASE_URL}/campaigns`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,  // ✅ Ensure token is properly set
      },
    });

    console.log("✅ Campaign Created:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error creating campaign:", error.response?.data || error.message);
    return null;
  }
};
