import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { getSavedCampaigns, saveCampaign } from "../controllers/userController.js";

const router = express.Router();

router.post("/:userId/save-campaign", authMiddleware, saveCampaign);
router.get("/:userId/saved-campaigns", authMiddleware, getSavedCampaigns );

export default router;
