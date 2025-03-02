import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Analytics from "./Analytics";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminPanel = () => {
  const { user, token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("campaigns");
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
      fetchCampaigns();
      fetchDonations();
    }
  }, [user]);

  const fetchUsers = async (query = "") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  const fetchCampaigns = async (query = "") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/campaigns?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(res.data);
    } catch (error) {
      console.error("❌ Error fetching campaigns:", error);
    }
  };

  const fetchDonations = async (query = "") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/donations?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data);
    } catch (error) {
      console.error("❌ Error fetching donations:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      let endpoint = `${API_BASE_URL}/api/admin`;

      if (searchCategory === "users") {
        endpoint += `/users/search?q=${encodeURIComponent(searchQuery)}`;
      } else if (searchCategory === "campaigns") {
        endpoint += `/campaigns/search?q=${encodeURIComponent(searchQuery)}`;
      } else if (searchCategory === "donations") {
        endpoint += `/donations/search?q=${encodeURIComponent(searchQuery)}`;
      }

      const res = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });

      if (searchCategory === "users") {
        setUsers(res.data);
        setActiveTab("users");
      }
      if (searchCategory === "campaigns") {
        setCampaigns(res.data);
        setActiveTab("campaigns");
      }
      if (searchCategory === "donations") {
        setDonations(res.data);
        setActiveTab("donations");
      }
    } catch (error) {
      console.error("❌ Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Admin Panel</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {["dashboard", "users", "campaigns", "donations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-lg rounded-lg transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <button onClick={logout} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto mb-6">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          onSearch={handleSearch}
        />
      </div>

      {loading && <p className="text-center text-gray-500">Loading search results...</p>}

      {activeTab === "dashboard" && <Analytics users={users} campaigns={campaigns} donations={donations} />}

      {activeTab === "users" && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">User Management</h3>
          <ul>
            {users.length > 0 ? (
              users.map((user) => (
                <li key={user._id} className="border p-3 my-2 rounded-lg bg-gray-50 shadow-sm">
                  <span className="font-semibold">{user.name}</span> - {user.email} ({user.role})
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No users found.</p>
            )}
          </ul>
        </div>
      )}

      {activeTab === "campaigns" && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Campaign Management</h3>
          <ul>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <li
                  key={campaign._id}
                  className="border p-4 my-2 rounded-lg bg-gray-50 shadow-sm flex justify-between items-center"
                >
                  <span className="font-semibold">{campaign.title}</span> - {campaign.status}
                  <button
                    onClick={() => setSelectedCampaign(campaign)}
                    className="bg-gray-500 px-3 py-1 text-white rounded-lg hover:bg-gray-600"
                  >
                    View
                  </button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No campaigns found.</p>
            )}
          </ul>
        </div>
      )}

      {activeTab === "donations" && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Donation Management</h3>
          <ul>
            {donations.length > 0 ? (
              donations.map((donation) => (
                <li key={donation._id} className="border p-4 my-2 rounded-lg bg-gray-50 shadow-sm">
                  <span className="font-semibold">{donation.user.name}</span> donated $
                  {donation.amount} to <span className="font-semibold">{donation.campaign.title}</span>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No donations found.</p>
            )}
          </ul>
        </div>
      )}

      <Modal isOpen={!!selectedCampaign} onClose={() => setSelectedCampaign(null)} title="Campaign Details">
        {selectedCampaign && (
          <div>
            <h3 className="text-lg font-bold">{selectedCampaign.title}</h3>
            <p className="text-gray-600">{selectedCampaign.description}</p>
            <p className="mt-2">Status: <span className="font-semibold">{selectedCampaign.status}</span></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPanel;
