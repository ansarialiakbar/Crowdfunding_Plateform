// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateCampaign from "./pages/CreateCampaign";
import Chat from "./pages/Chat";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";  // Import Dashboard
import PrivateRoute from "./components/PrivateRoute";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute requiredRole="creator" />}>
          <Route path="/create" element={<CreateCampaign />} />
        </Route>

        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        <Route path="/chat" element={<Chat />} />
        
        {/* ✅ Fix: Add Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
