// src/routes/paymentRoutes.js
// import express from "express";
// import { createPaymentIntent } from "../controllers/paymentController.js";

// const router = express.Router();

// router.post("/create-payment-intent", createPaymentIntent);

// export default router;
import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

// ✅ Create a new Razorpay Order
router.post("/create-order", createRazorpayOrder);

// ✅ Verify Razorpay Payment & Update Campaign
router.post("/verify-payment", verifyPayment);

export default router;
