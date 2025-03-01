import Campaign from "../models/Campaign.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";

export const getAllCampaigns = async (req, res) => {
  try {
    console.log("📢 Fetching campaigns...");

    let query = {};
    let sortQuery = {};

    // ✅ If 'trending=true' is in the request, filter and sort campaigns
    if (req.query.trending === "true") {
      query = { raised: { $gt: 0 } }; // Only include campaigns with funds raised
      sortQuery = { raised: -1 }; // Sort by highest funds raised
    }

    const campaigns = await Campaign.find(query)
      .sort(sortQuery)
      .populate("creator", "name email");

    res.json(campaigns);
  } catch (error) {
    console.error("❌ Error fetching campaigns:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get a Single Campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
   // ✅ Ensure backers count is included
   res.json({
    _id: campaign._id,
    title: campaign.title,
    description: campaign.description,
    category: campaign.category,
    goal: campaign.goal,
    raised: campaign.raised,
    backers: campaign.backers || 0,  // ✅ Ensure backers count is always included
    image: campaign.image,
  });
  } catch (error) {
    console.error("❌ Error fetching campaign:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Update Campaign Funds & Backers Count
export const updateCampaignFunds = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({ error: "Campaign ID and amount are required" });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    campaign.raised += parseFloat(amount);
    campaign.backers += 1;
    await campaign.save();

    res.json({ success: true, message: "Campaign funds updated successfully" });
  } catch (error) {
    console.error("❌ Campaign Update Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 CREATE CAMPAIGN WITH IMAGE UPLOAD

export const createCampaign = async (req, res) => {
  try {
    console.log("📢 Received Data:", req.body, req.file); // Debug incoming data

    const { title, description, category, goal, deadline } = req.body;
    const userId = req.user.id;

    // ✅ Ensure goal is converted to a Number
    const parsedGoal = Number(goal);
    if (!title || !description || !category || isNaN(parsedGoal) || !deadline) {
      return res.status(400).json({ error: "All fields are required and goal must be a valid number" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image upload is required" });
    }

    // ✅ Upload image using buffer
    const imageBuffer = req.file.buffer;
    let imageUrl;

    try {
      imageUrl = await cloudinaryUpload(imageBuffer);
    } catch (uploadError) {
      console.error("❌ Cloudinary Upload Failed:", uploadError);
      return res.status(500).json({ error: "Image upload failed. Please try again." });
    }

    // Save campaign to DB
    const campaign = await Campaign.create({
      title,
      description,
      category,
      goal: parsedGoal,  // ✅ Ensure goal is stored as a Number
      deadline,
      image: imageUrl,
      creator: userId,
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error("❌ Error creating campaign:", error);
    res.status(400).json({ error: error.message });
  }
}; 

// ✅ Get Campaigns Created by a Specific User
export const getUserCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creator: req.params.userId });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user campaigns." });
  }
};
