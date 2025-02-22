// useAuth.js - Hook for authentication
import { useAuth } from "../context/AuthContext";

const useAuth = () => {
  const { user, login, signup, logout } = useAuth();
  return { user, login, signup, logout };
};

export default useAuth;
