const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ✅ Function to load Razorpay SDK dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export const processPayment = async (amount, campaignId) => {
  try {
    // ✅ Load Razorpay script before using it
    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      throw new Error("Failed to load Razorpay. Please check your internet connection.");
    }

    // ✅ Request order creation from backend
    const res = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, campaignId }),
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const { orderId, key } = await res.json();
    if (!orderId) {
      throw new Error("Failed to create Razorpay order.");
    }

    // ✅ Razorpay payment options
    const options = {
      key: key,
      amount: amount * 100,
      currency: "INR",
      order_id: orderId,
      name: "Crowdfunding Platform",
      description: "Donate to Campaign",
      image: "/images/logo.png",
      handler: async (response) => {
        // ✅ Verify the payment with backend
        await fetch(`${API_BASE_URL}/api/payments/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            campaignId,
            amount,
          }),
        });

        alert(`✅ Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Donor",
        email: "donor@example.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    // ✅ Initialize Razorpay after script is loaded
    const rzp = new window.Razorpay(options);
    rzp.open();
    return true;
  } catch (error) {
    console.error("❌ Payment Error:", error);
    return false;
  }
};
