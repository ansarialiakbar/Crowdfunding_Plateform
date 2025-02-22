// src/pages/CreateCampaign.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createCampaign } from "../services/campaignService";

const CreateCampaign = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || !token) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
    }
  }, [user, token, navigate, location]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB.");
      setImage(null);
    } else {
      setError("");
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert("Please log in to create a campaign.");
      navigate("/login");
      return;
    }

    if (!image) {
      setError("Please upload an image.");
      return;
    }

    console.log("📢 Sending request with token:", token); // Debugging token

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("goal", goal);
    formData.append("deadline", deadline);
    formData.append("image", image);
    console.log("📢 Sending FormData:", Object.fromEntries(formData.entries())); // Debug FormData

    try {
      const response = await createCampaign(formData, token);
      if (response) {
        navigate("/campaigns");
      } else {
        setError("Failed to create campaign.");
      }
    } catch (error) {
      console.error("❌ Campaign creation error:", error);
      setError(error.response?.data?.message || "Error creating campaign. Please try again.");
    }
  };

  if (!user || !token) {
    return <p className="text-center text-gray-600">Checking authentication...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create a New Campaign</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            type="text"
            placeholder="Campaign Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Campaign Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Tech">Tech</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Charity">Charity</option>
          </select>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            type="number"
            placeholder="Funding Goal ($)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          <label className="block text-gray-600 font-semibold">Upload Cover Image</label>
          <input
            className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 outline-none"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold p-3 rounded-lg shadow-lg"
          >
            Submit Campaign
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
