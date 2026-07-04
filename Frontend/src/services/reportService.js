import api from "../api/axios";

// ===============================
// Reports
// ===============================

export const getDashboardSummary = async () => {
  const response = await api.get("/reports/dashboard");
  return response.data.data;
};

export const getRevenueChart = async (range = "1m", month, year) => {
  const params = new URLSearchParams({ range });

  if (month) params.append("month", month);
  if (year) params.append("year", year);

  const response = await api.get(`/reports/chart?${params.toString()}`);
  return response.data.data;
};

export const getMonthlySales = async () => {
  const response = await api.get("/reports/sales");
  return response.data.data;
};

export const getTopProducts = async () => {
  const response = await api.get("/reports/products");
  return response.data.data;
};

export const getCustomerReport = async () => {
  const response = await api.get("/reports/customers");
  return response.data.data;
};

// ดึงรายการคำสั่งซื้อล่าสุด
export const getRecentOrders = async () => {
  const response = await api.get("/reports/orders");
  return response.data.data;
};

// ดึงสรุปสถานะคำสั่งซื้อ
export const getOrderStatusReport = async () => {
  const response = await api.get("/reports/status");
  return response.data.data;
};
