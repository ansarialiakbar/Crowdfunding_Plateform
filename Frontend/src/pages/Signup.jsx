// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role.");
      return;
    }

    try {
      const success = await signup(name, email, password, role);
      if (success) {
        navigate("/dashboard"); // Redirect after successful signup
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg mt-4 w-96">
        <input 
          className="border p-2 w-full mb-4" 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
        />
        <input 
          className="border p-2 w-full mb-4" 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <input 
          className="border p-2 w-full mb-4" 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        
        <select 
          className="border p-2 w-full mb-4" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="backer">Backer</option>
          <option value="creator">Creator</option>
        </select>

        <button className="bg-green-500 text-white w-full p-2 rounded">Sign Up</button>
      </form>

      <p className="mt-4">
        Already have an account?  
        <Link to="/login" className="text-blue-600 underline ml-2">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
