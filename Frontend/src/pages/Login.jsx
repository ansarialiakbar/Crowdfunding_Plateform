// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await login(email, password);
      if (success) {
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/dashboard";
        localStorage.removeItem("redirectAfterLogin"); // Clear redirect path after login
        navigate(redirectPath);
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg mt-4 w-96">
        <input className="border p-2 w-full mb-4" type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-blue-500 text-white w-full p-2 rounded">Login</button>
      </form>
      <p className="mt-4">
        Don't have an account?  
        <Link to="/signup" className="text-blue-600 underline ml-2">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
