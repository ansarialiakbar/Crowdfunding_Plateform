import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["admin", "creator", "backer"], required: true },
  phone: { type: String },
  profilePic: { type: String, default: "/images/default-avatar.png" },  // ✅ Added profile picture field
  savedCampaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
});

export default mongoose.model("User", UserSchema);
