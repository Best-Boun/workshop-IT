import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// ===============================
// Orders
// ===============================

// ดึงคำสั่งซื้อทั้งหมด
export const getAllOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

// ดึงคำสั่งซื้อตาม id
export const getOrder = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

// แก้ไขสถานะคำสั่งซื้อ
export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}/status`, { status });
  return response.data;
};

// ลบคำสั่งซื้อ
export const deleteOrder = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
