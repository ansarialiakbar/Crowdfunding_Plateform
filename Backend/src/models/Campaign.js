import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goal: { type: Number, required: true, min: 1 },  // ✅ Ensure goal is a valid number
    raised: { type: Number, default: 0 },
    category: { type: String, required: true },
    deadline: { type: Date, required: true },
    image: { type: String, required: true },
    backers: { type: Number, default: 0 }, // ✅ Ensure backers count is stored
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", CampaignSchema);
