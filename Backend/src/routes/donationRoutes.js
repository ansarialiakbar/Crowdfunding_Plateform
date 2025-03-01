import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { createDonation, getUserDonations } from "../controllers/donationController.js";

const router = express.Router();

// ✅ Route for making a donation
router.post("/", authMiddleware, createDonation);

// ✅ Route for fetching user donations
router.get("/user/:userId", authMiddleware, getUserDonations);

export default router;
