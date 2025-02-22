// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser, logoutUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("❌ Error parsing stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);

      if (data?.user && data?.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
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
        return { success: true };
      } else {
        return { success: false, message: "Signup failed" };
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
