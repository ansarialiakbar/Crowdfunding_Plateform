// src/routes/authRoutes.js
import express from "express";
import { signup, login, logout, getUserProfile, getAllUsers, updateUserProfile, changePassword, uploadProfilePic } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Authentication Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// ✅ User Profile Routes
router.get("/user", authMiddleware, getUserProfile);
router.get("/user/:userId", authMiddleware, getUserProfile);
router.get("/users", authMiddleware, getAllUsers);
router.put("/update-profile/:userId", authMiddleware, updateUserProfile);
router.put("/change-password/:userId", authMiddleware, changePassword);
router.post("/upload-profile-pic/:userId", authMiddleware, upload.single("profilePic"), uploadProfilePic);

export default router;
