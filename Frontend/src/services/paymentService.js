// paymentService.js - Handles payment processing
export const processPayment = async (amount) => {
  const res = await fetch("/api/payment", { method: "POST", body: JSON.stringify({ amount }), headers: { "Content-Type": "application/json" } });
  const { orderId } = await res.json();

  const options = {
    key: "RAZORPAY_KEY",
    amount: amount * 100,
    currency: "INR",
    order_id: orderId,
    handler: (response) => alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`),
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
