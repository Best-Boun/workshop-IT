import api from "../api/axios";

// ===============================
// Orders
// ===============================

// ดึงคำสั่งซื้อทั้งหมด
export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data.data;
};

// ดึงคำสั่งซื้อตาม id
export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data.data;
};

// แก้ไขสถานะคำสั่งซื้อ
export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

// ลบคำสั่งซื้อ
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
