import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

// ===============================
// Reports
// ===============================

export const getDashboardSummary = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data.data;
};

export const getMonthlySales = async () => {
  const response = await axios.get(`${API_URL}/sales`);
  return response.data.data;
};

export const getTopProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data.data;
};

export const getCustomerReport = async () => {
  const response = await axios.get(`${API_URL}/customers`);
  return response.data.data;
};

// ดึงรายการคำสั่งซื้อล่าสุด
export const getRecentOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data.data;
};
