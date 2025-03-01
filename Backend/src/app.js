// src/app.js
import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables at the very beginning

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import path from "path";

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debugging: Check if environment variables are loaded
console.log("✅ Checking Environment Variables in app.js:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ Missing");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY || "❌ Missing");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌");

// Serve Uploaded Images
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes); 

// Global Error Handling Middleware
app.use(errorMiddleware);

// Default Route
app.get("/", (req, res) => {
  res.send("✅ Crowdfunding API is Running...");
});

// Export Express App for `server.js`
export { app };
