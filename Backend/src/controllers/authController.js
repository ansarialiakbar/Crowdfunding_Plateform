// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { cloudinaryUpload } from "../utils/cloudinary.js"; 

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in the environment variables.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

// ✅ LOGOUT USER
export const logout = async (req, res) => {
  try {
    // If using cookies for session-based auth
    res.clearCookie("token");

    // ✅ Inform the client to remove token from storage
    res.json({ message: "Logout successful. Please remove token from local storage." });
  } catch (error) {
    res.status(500).json({ error: "Error logging out." });
  }
};

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    let user;
    if (req.params.userId) {
      user = await User.findById(req.params.userId).select("-password");
    } else {
      user = await User.findById(req.user._id).select("-password");
    }

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile." });
  }
};

// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { name, email, phone },
      { new: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating profile." });
  }
};

// ✅ Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect old password." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error changing password." });
  }
};

// ✅ Upload Profile Picture
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded." });

    const imageBuffer = req.file.buffer;
    const imageUrl = await cloudinaryUpload(imageBuffer);
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { profilePic: imageUrl },
      { new: true }
    ).select("-password");

    res.json({ profilePic: user.profilePic });
  } catch (error) {
    res.status(500).json({ error: "Error uploading profile picture." });
  }
};
// ✅ Get All Users for Chat
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email"); // Return only necessary fields
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users." });
  }
};