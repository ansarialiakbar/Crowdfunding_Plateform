import express from "express";
import { getAllUsers, getAllCampaigns, getAllDonations } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin routes (protected)
router.get("/users", authMiddleware, getAllUsers);
router.get("/campaigns", authMiddleware, getAllCampaigns);
router.get("/donations", authMiddleware, getAllDonations);
// ✅ Search feature for users, campaigns, and donations
router.get("/users/search", authMiddleware, getAllUsers);
router.get("/campaigns/search", authMiddleware, getAllCampaigns);
router.get("/donations/search", authMiddleware, getAllDonations);

export default router;
