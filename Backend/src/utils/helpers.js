// src/utils/helpers.js
export const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
export const generateUniqueID = () => Math.random().toString(36).substr(2, 9);
