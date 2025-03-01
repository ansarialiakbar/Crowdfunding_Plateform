import mongoose from "mongoose"; 
import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
// ✅ Get Donations for a User
export const getUserDonations = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`📢 Fetching donations for user: ${userId}`);
     // ✅ Convert userId to ObjectId
     if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn(`⚠ Invalid user ID: ${userId}`);
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const donations = await Donation.find({ user: new mongoose.Types.ObjectId(userId) })
      .populate("campaign", "title");

      if (!donations || donations.length === 0) {
        console.warn(`⚠ No donations found for user: ${userId}`);
        return res.json([]);  // ✅ Return empty array instead of 404
      }

    res.json(donations);
  } catch (error) {
    console.error("❌ Error fetching user donations:", error);
    res.status(500).json({ error: "Error fetching user donations." });
  }
};


// ✅ Ensure donation is saved properly when made
export const createDonation = async (req, res) => {
    try {
      const { userId, campaignId, amount } = req.body;
  
      // ✅ Validate request
      if (!userId || !campaignId || !amount) {
        return res.status(400).json({ error: "Missing required fields." });
      }
        // ✅ Convert userId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
  
      // ✅ Ensure campaign exists
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found." });
      }
  
      // ✅ Save donation with proper ObjectId references
    const donation = new Donation({
      user: new mongoose.Types.ObjectId(userId),
      campaign: new mongoose.Types.ObjectId(campaignId),
      amount,
    });
  
      await donation.save();
  
      // ✅ Update campaign funds raised
      campaign.fundsRaised += amount;
      await campaign.save();
  
      res.status(201).json({ message: "Donation successful.", donation });
    } catch (error) {
      console.error("❌ Error processing donation:", error);
      res.status(500).json({ error: "Failed to process donation." });
    }
  };
