import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const { user, logout, fetchUserDonations, userDonations } = useAuth();
  const [userData, setUserData] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserCampaigns();
      fetchUserDonations(); // ✅ Fetch donations from AuthContext
    }
  }, [user]);

  // ✅ Fetch user profile details
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/api/auth/user/${user._id || user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(res.data);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      setError("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch user-created campaigns
  const fetchUserCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const userId = user?._id || user?.id; // ✅ Ensure correct `userId`
      console.log("📢 Fetching campaigns for user:", userId);

      const res = await axios.get(`${API_BASE_URL}/api/campaigns/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.length > 0) {
        console.log("✅ Campaigns fetched successfully:", res.data);
      } else {
        console.warn("⚠ No campaigns found for this user.");
      }

      setCampaigns(res.data);
    } catch (error) {
      console.error("❌ Error fetching campaigns:", error);
    }
  };

  // ✅ Handle profile picture upload
  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.post(`${API_BASE_URL}/api/auth/upload-profile-pic/${user._id || user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setProfilePic(res.data.profilePic);
      alert("✅ Profile picture updated!");
    } catch (error) {
      console.error("❌ Error uploading profile picture:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading profile...</p>;
  if (!user) return <p className="text-center text-red-500">Please log in to view profile.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Sidebar Navigation */}
        <div className="flex">
          <div className="w-1/4 border-r p-4">
            <h2 className="text-2xl font-bold">Profile</h2>
            <ul className="mt-4 space-y-2">
              <li className={`cursor-pointer p-2 rounded ${activeTab === "overview" ? "bg-blue-500 text-white" : "text-gray-700"}`} onClick={() => setActiveTab("overview")}>
                Overview
              </li>
              <li className={`cursor-pointer p-2 rounded ${activeTab === "campaigns" ? "bg-blue-500 text-white" : "text-gray-700"}`} onClick={() => setActiveTab("campaigns")}>
                My Campaigns
              </li>
              <li className={`cursor-pointer p-2 rounded ${activeTab === "donations" ? "bg-blue-500 text-white" : "text-gray-700"}`} onClick={() => setActiveTab("donations")}>
                My Donations
              </li>
              <li className={`cursor-pointer p-2 rounded ${activeTab === "settings" ? "bg-blue-500 text-white" : "text-gray-700"}`} onClick={() => setActiveTab("settings")}>
                Settings
              </li>
              <li className="cursor-pointer p-2 rounded bg-red-500 text-white" onClick={logout}>
                Logout
              </li>
            </ul>
          </div>

          {/* Profile Content */}
          <div className="w-3/4 p-4">
            {activeTab === "overview" && (
              <div>
                <h3 className="text-xl font-bold">Profile Overview</h3>
                <div className="mt-4">
                  <label htmlFor="profilePicUpload">
                    <img
                      src={profilePic || userData.profilePic || "/images/default-avatar.png"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border cursor-pointer"
                    />
                  </label>
                  <input id="profilePicUpload" type="file" className="hidden" onChange={handleProfilePicUpload} />

                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Phone:</strong> {userData.phone || "Not added"}</p>
                  <p><strong>Account Type:</strong> {userData.role}</p>
                </div>
              </div>
            )}

            {activeTab === "campaigns" && (
              <div>
                <h3 className="text-xl font-bold">My Campaigns</h3>
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <div key={campaign._id} className="border p-3 my-2 rounded shadow">
                      <h4 className="font-semibold">{campaign.title}</h4>
                      <p>{campaign.description.substring(0, 100)}...</p>
                    </div>
                  ))
                ) : (
                  <p>No campaigns found.</p>
                )}
              </div>
            )}

            {activeTab === "donations" && (
              <div>
                <h3 className="text-xl font-bold">My Donations</h3>
                {userDonations.length > 0 ? (
                  userDonations.map((donation) => (
                    <div key={donation._id} className="border p-3 my-2 rounded shadow">
                      <p>
                        Donated <strong>${donation.amount}</strong> to{" "}
                        <strong>{donation.campaign?.title || "Unknown Campaign"}</strong>
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No donations made yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
