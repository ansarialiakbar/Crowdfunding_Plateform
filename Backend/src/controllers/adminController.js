import User from "../models/User.js";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";

// ✅ Get all users (Admin only) with Search
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    
    const searchQuery = req.query.q || "";
    const users = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search
        { email: { $regex: searchQuery, $options: "i" } }
      ]
    }).select("-password");
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Get all campaigns (Admin only) with Search
export const getAllCampaigns = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const searchQuery = req.query.q || "";
    const campaigns = await Campaign.find({
      title: { $regex: searchQuery, $options: "i" } // Case-insensitive search
    });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// ✅ Get all donations (Admin only) with Search
export const getAllDonations = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const searchQuery = req.query.q || "";
    const donations = await Donation.find()
      .populate("user", "name email")
      .populate("campaign", "title")
      .then((donations) =>
        donations.filter((donation) =>
          donation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donation.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donation.campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};
