import express from "express";
import multer from "multer";
import { getAllCampaigns, createCampaign, getCampaignById, updateCampaignFunds, getUserCampaigns } from "../controllers/campaignController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Fix: Use Memory Storage (not local storage)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);
router.post("/", authMiddleware, upload.single("image"), createCampaign);  // ✅ Protected route
// ✅ Update campaign funds after a successful payment
router.post("/donate", updateCampaignFunds);
router.get("/user/:userId", authMiddleware, getUserCampaigns); // ✅ Fetch User Campaigns

export default router;
