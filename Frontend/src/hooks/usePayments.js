import { processPayment } from "../services/paymentService";

const usePayments = () => {
  const handlePayment = async (amount, campaignId) => {
    return await processPayment(amount, campaignId);
  };

  return { handlePayment };
};

export default usePayments;
