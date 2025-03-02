import User from "../models/User.js";
import Campaign from "../models/Campaign.js";

// ✅ Save or Unsave a Campaign
export const saveCampaign = async (req, res) => {
  const { userId } = req.params;
  const { campaignId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.savedCampaigns.includes(campaignId)) {
      user.savedCampaigns = user.savedCampaigns.filter((id) => id.toString() !== campaignId);
      await user.save();
      return res.json({ message: "Campaign removed from saved list." });
    } else {
      user.savedCampaigns.push(campaignId);
      await user.save();
      return res.json({ message: "Campaign saved successfully." });
    }
  } catch (error) {
    console.error("❌ Error saving campaign:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get Saved Campaigns for a User
export const getSavedCampaigns = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("savedCampaigns");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.savedCampaigns);
  } catch (error) {
    console.error("❌ Error fetching saved campaigns:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
