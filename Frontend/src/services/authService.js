// src/services/authService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // Ensure correct API URL

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password }, { withCredentials: true });
    console.log("Login Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    return null;
  }
};

export const signupUser = async (name, email, password, role) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password, role }, { withCredentials: true });
    console.log("Signup Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.warn("⚠ No token found, skipping logout request.");
      return;
    }

    await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}` // ✅ Ensure token is sent
      },
      withCredentials: true
    });

    console.log("✅ Logout successful.");
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
  }
};

// ✅ Fetch User Profile
export const getUserProfile = async (authToken) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/auth/user`, {
      headers: { Authorization: `Bearer ${authToken}` },
      withCredentials: true
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    return null;
  }
};