import express from "express";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

router.post("/submit", submitContactForm); // ✅ POST route for contact form

export default router;
