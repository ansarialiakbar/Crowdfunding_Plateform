import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ Import User model to verify existence in DB

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("🚨 No valid Authorization header received.");
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract actual token
    console.log(`📢 Received Token: ${token}`); // ✅ Debugging log

    // ✅ Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Ensure user exists in the database
    const user = await User.findById(decoded.id).select("-password"); // Fetch user without password
    if (!user) {
      console.warn("🚨 User from token not found in DB.");
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user; // Attach user object to request
    console.log("✅ Token verified successfully:", decoded);

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
