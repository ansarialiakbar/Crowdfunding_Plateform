import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Element } from "react-scroll"; // ✅ Import for scrolling
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CampaignCard from "../components/CampaignCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const { user } = useAuth();
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Background images for slideshow
  const bgImages = [
    "/images/hero-bg1.jpg",
    "/images/hero-bg2.jpg",
    "/images/hero-bg3.jpg",
    "/images/hero-bg4.jpeg",
  ];
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // ✅ Fetch trending campaigns sorted by highest funds raised
    axios
      .get(`${API_BASE_URL}/api/campaigns?trending=true`)
      .then((res) => {
        if (isMounted) {
          const sortedCampaigns = res.data.sort((a, b) => b.fundsRaised - a.fundsRaised);
          setFeaturedCampaigns(sortedCampaigns);
          setLoading(false);
          if (sortedCampaigns.length > 0) {
            setCurrentIndex(0); // ✅ Reset index when data is available
          }
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching trending campaigns:", err);
        if (isMounted) {
          setError("Failed to load campaigns.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Auto-scroll through campaigns every 4 seconds
  useEffect(() => {
    if (featuredCampaigns.length === 0) return;
    const campaignInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredCampaigns.length);
    }, 4000);

    return () => clearInterval(campaignInterval);
  }, [featuredCampaigns]);

  // ✅ Background slideshow effect
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBg((prevBg) => (prevBg + 1) % bgImages.length);
    }, 5000);

    return () => clearInterval(bgInterval);
  }, []);

  // ✅ Manual Navigation (Left & Right)
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredCampaigns.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? featuredCampaigns.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-gray-50">
      {/* ✅ Navbar */}
      <Navbar />

      {/* ✅ Hero Section */}
      <div className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {bgImages.map((bg, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentBg ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* ✅ Hero Text */}
        <div className="relative z-10 text-white px-6">
          <h1 className="text-5xl font-extrabold tracking-wide animate-fadeIn">
            Empower Your Ideas, Fund Your Dreams 🚀
          </h1>
          <p className="mt-4 text-lg animate-fadeInDelay">
            Join millions of innovators and backers. Your next big project starts here.
          </p>
          <div className="mt-6 space-x-4">
            <Link
              to="/campaigns"
              className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-white font-bold shadow-lg"
            >
              Explore Campaigns
            </Link>
            {user ? (
              <Link
                to="/create"
                className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg text-white font-bold shadow-lg"
              >
                Start a Campaign
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-yellow-500 hover:bg-yellow-600 transition px-6 py-3 rounded-lg text-white font-bold shadow-lg"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Trending Campaigns (Only 1 at a time) */}
      <section className="p-10 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">🔥 Trending Campaigns</h2>

        {loading ? (
          <p className="text-gray-600">Loading campaigns...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : featuredCampaigns.length > 0 ? (
          <div className="relative flex justify-center items-center">
            {/* ✅ Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-0 z-10 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition"
            >
              <ChevronLeft size={24} />
            </button>

            {/* ✅ Display Only One Campaign */}
            <div className="max-w-lg">
              {featuredCampaigns[currentIndex] && (
                <CampaignCard
                  key={featuredCampaigns[currentIndex]._id}
                  campaign={featuredCampaigns[currentIndex]}
                />
              )}
            </div>

            {/* ✅ Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-0 z-10 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        ) : (
          <p className="text-gray-600">No trending campaigns available.</p>
        )}
      </section>

      {/* ✅ Categories */}
      <Element name="categories">
        <section className="p-10 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">Explore Categories</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {["Tech", "Education", "Health", "Charity"].map((category, index) => (
              <div
                key={index}
                className="p-6 bg-white text-black shadow-lg rounded-lg transform hover:scale-105 transition"
              >
                <h3 className="text-xl font-bold">{category}</h3>
              </div>
            ))}
          </div>
        </section>
      </Element>
      {/* ✅ How It Works */}
      <Element name="how-it-works">
        <section className="p-10 bg-gray-100 text-center">
          <h2 className="text-4xl font-bold mb-6">How It Works</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {["Create a Campaign", "Share Your Story", "Receive Funds"].map((step, index) => (
              <div key={index} className="p-6 w-72 bg-white shadow-lg rounded-lg transform hover:scale-105 transition">
                <h3 className="text-xl font-bold">{step}</h3>
              </div>
            ))}
          </div>
        </section>
      </Element>

      {/* ✅ Call to Action */}
      <section className="p-10 text-center bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <h2 className="text-4xl font-bold mb-5">Ready to Launch Your Idea?</h2>
        <Link
          to="/create"
          className="mt-8 bg-white text-blue-600 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition"
        >
          Start a Campaign
        </Link>
      </section>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default Home;
