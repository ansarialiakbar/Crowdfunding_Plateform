import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Donation", DonationSchema);
