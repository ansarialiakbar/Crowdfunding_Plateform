// usePayments.js - Hook for payment handling
import { processPayment } from "../services/paymentService";

const usePayments = () => {
  const handlePayment = async (amount) => {
    return await processPayment(amount);
  };

  return { handlePayment };
};

export default usePayments;
