import axios from "axios";

const API_URL = "http://localhost:5000/api/customers";

// ===============================
// Customers
// ===============================

// ดึงลูกค้าทั้งหมด
export const getAllCustomers = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

// ดึงลูกค้าตาม id
export const getCustomer = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

// แก้ไขลูกค้า
export const updateCustomer = async (id, customer) => {
  const response = await axios.put(`${API_URL}/${id}`, customer);
  return response.data;
};

// ลบลูกค้า
export const deleteCustomer = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
