import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails"; // ✅ Import CampaignDetails
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateCampaign from "./pages/CreateCampaign";
import Chat from "./pages/Chat";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import SavedCampaigns from "./pages/SavedCampaigns"; // ✅ Import Page
import PrivateRoute from "./components/PrivateRoute";
import "@fortawesome/fontawesome-free/css/all.min.css";


const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} /> {/* ✅ Fix: Add this route */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/saved" element={<SavedCampaigns />} /> {/* ✅ New Route */}

        {/* Protected Routes */}
        <Route element={<PrivateRoute requiredRole="creator" />}>
          <Route path="/create" element={<CreateCampaign />} />
        </Route>

        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
