import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser, logoutUser, getUserProfile } from "../services/authService";

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userDonations, setUserDonations] = useState([]); // ✅ Store user donations
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state for better UX

  // ✅ Ensure token is correctly used for API calls
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      fetchUserProfile(storedToken);
    } else {
      setLoading(false); // ✅ Stop loading if no token is found
    }

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

        // ✅ Fetch donations only if userId exists
        // if (parsedUser._id) {
        //   fetchUserDonations(parsedUser._id, storedToken);
        // }
      } catch (error) {
        console.error("❌ Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // ✅ Fetch user donations after token is available
  useEffect(() => {
    if (user && token) {
      fetchUserDonations(user._id, token);
    }
  }, [user, token]);

  // ✅ Fetch user profile from backend
  const fetchUserProfile = async (authToken) => {
    try {
      const userData = await getUserProfile(authToken);
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        console.warn("⚠ No user data found.");
        logout(); // ✅ Auto-logout if no user data is returned
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      logout(); // ✅ Logout on token expiration
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCampaigns = async (userId) => {
    if (!userId || !token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/${userId}/saved-campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setSavedCampaigns(res.data);
        console.log("✅ Saved campaigns fetched:", res.data);
        return res.data; // ✅ Ensure data is returned
      } else {
        console.error("❌ Unexpected response format:", res.data);
        setSavedCampaigns([]);
        return [];
      }
    } catch (error) {
      console.error("❌ Error fetching saved campaigns:", error);
      setSavedCampaigns([]);
      return [];
    }
  };


  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);

      if (data?.user && data?.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        // ✅ Fetch donations after login
        fetchUserDonations(data.user._id, data.token);
        return { success: true };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const data = await signupUser(name, email, password, role);

      if (data?.user && data?.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        // ✅ Fetch donations after signup
        fetchUserDonations(data.user._id, data.token);
        return { success: true };
      } else {
        return { success: false, message: "Signup failed" };
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setToken(null);
      setUserDonations([]); // ✅ Clear donations on logout
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // ✅ Fetch user donations
  const fetchUserDonations = async (userId, authToken) => {
    if (!userId || !authToken) {
      console.error("❌ Missing user ID or token for donations fetch.");
      return;
    }

    try {
      console.log(`📢 Fetching donations for user: ${userId}`);

      const res = await axios.get(`${API_BASE_URL}/api/donations/user/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (Array.isArray(res.data)) {
        setUserDonations(res.data);
        console.log("✅ Donations fetched successfully:", res.data);
      } else {
        console.warn("⚠ Unexpected response format:", res.data);
        setUserDonations([]);
      }
    } catch (error) {
      console.error("❌ Error fetching user donations:", error);
      setUserDonations([]); // ✅ Ensure empty state instead of throwing an error
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, userDonations, fetchUserDonations, loading, fetchSavedCampaigns }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
