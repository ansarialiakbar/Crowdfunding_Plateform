import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Campaign from "../models/Campaign.js"; // ✅ Ensure the campaign model is imported

dotenv.config();

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create a Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, campaignId } = req.body;

    if (!amount || !campaignId) {
      return res.status(400).json({ error: "Amount and campaign ID are required" });
    }

    const options = {
      amount: amount * 100, // Convert amount to paisa (INR)
      currency: "INR",
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Razorpay Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Verify Razorpay Payment & Update Campaign
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, campaignId, amount } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !campaignId) {
      return res.status(400).json({ error: "Missing required payment details" });
    }

    // 🔹 Verify payment signature using Razorpay secret
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // 🔹 Update campaign funds & backers count
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    campaign.raised += parseFloat(amount);
    // ✅ Ensure backers count increments properly
    if (!campaign.backers) {
      campaign.backers = 1;
    } else {
      campaign.backers += 1;
    }
    await campaign.save();

    res.json({ success: true, message: "Payment verified and campaign updated" });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
};
