// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CampaignCard from "../components/CampaignCard";

const Home = () => {
  const { user } = useAuth();
  const featuredCampaigns = [
    { id: 1, title: "AI-Powered Smart Glasses", image: "/images/smart-glasses.jpg", description: "Revolutionary AI-powered glasses that enhance vision and productivity." },
    { id: 2, title: "Sustainable Solar Backpack", image: "/images/solar-backpack.jpg", description: "Charge devices on the go with this eco-friendly solar backpack." },
  ];

  // Background images for slideshow
  const bgImages = [
    "/images/hero-bg1.jpg",
    "/images/hero-bg2.jpg",
    "/images/hero-bg3.jpg",
    "/images/hero-bg4.jpg"
  ];

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prevBg) => (prevBg + 1) % bgImages.length); // No delay when looping
    }, 5000); // Image changes every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Ensure Navbar is always visible */}
      <div className="relative z-20">
        <Navbar />
      </div>
      
      {/* Hero Section with Overlay */}
      <div className="relative h-[500px] flex flex-col justify-center items-center text-center">
        {/* Background Images (Stacked for Smooth Transition) */}
        {bgImages.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentBg ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}

        {/* Dark Overlay for better visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Hero Text */}
        <div className="relative z-10 text-white">
          <h1 className="text-5xl font-bold">Transform Your Ideas into Reality</h1>
          <p className="mt-4 text-lg">Join millions of backers and innovators on CrowdFund.</p>
          <div className="mt-6">
            <Link to="/campaigns" className="bg-blue-600 px-6 py-3 rounded-lg text-white font-bold mr-4">Explore Campaigns</Link>
            {user ? (
              <Link to="/create" className="bg-green-600 px-6 py-3 rounded-lg text-white font-bold">Start a Campaign</Link>
            ) : (
              <Link to="/signup" className="bg-yellow-500 px-6 py-3 rounded-lg text-white font-bold">Sign Up</Link>
            )}
          </div>
        </div>
      </div>

      {/* Featured Campaigns - Ensure Visibility */}
      <section className="p-10 text-center relative z-10 bg-white">
        <h2 className="text-3xl font-bold mb-6 text-black">Trending Campaigns</h2>
        <div className="grid grid-cols-2 gap-6">
          {featuredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="p-10 bg-gray-100 text-center relative z-10">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <div className="flex justify-center mt-6">
          <div className="m-4 p-4 w-1/3 bg-white shadow rounded">
            <h3 className="text-xl font-bold">1. Create a Campaign</h3>
            <p>Describe your idea and set a funding goal.</p>
          </div>
          <div className="m-4 p-4 w-1/3 bg-white shadow rounded">
            <h3 className="text-xl font-bold">2. Share Your Story</h3>
            <p>Promote your campaign to reach more backers.</p>
          </div>
          <div className="m-4 p-4 w-1/3 bg-white shadow rounded">
            <h3 className="text-xl font-bold">3. Receive Funds</h3>
            <p>Secure funding and bring your project to life.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="p-10 text-center relative z-10">
        <h2 className="text-3xl font-bold mb-5">Ready to Launch Your Idea?</h2>
        <Link to="/create" className="mt-8 bg-blue-600 px-6 py-3 text-white font-bold rounded-lg">Start a Campaign</Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
