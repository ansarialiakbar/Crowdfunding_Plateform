// src/services/authService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"; // Ensure correct API URL

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, { withCredentials: true });
    console.log("Login Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    return null;
  }
};

export const signupUser = async (name, email, password, role) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/signup`, { name, email, password, role }, { withCredentials: true });
    console.log("Signup Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
  }
};
