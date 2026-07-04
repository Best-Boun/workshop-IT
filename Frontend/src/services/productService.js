import axios from "axios";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_URL = "http://localhost:5000/api/products/categories/all";

// ===============================
// Products
// ===============================

// ดึงสินค้าทั้งหมด
export const getAllProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

// ดึงสินค้าตาม id
export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

// เพิ่มสินค้า
export const createProduct = async (product) => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

// แก้ไขสินค้า
export const updateProduct = async (id, product) => {
  const response = await axios.put(`${API_URL}/${id}`, product);
  return response.data;
};

// ลบสินค้า
export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// ===============================
// Categories
// ===============================

// ดึงหมวดหมู่ทั้งหมด
export const getCategories = async () => {
  const response = await axios.get(CATEGORY_URL);
  return response.data.data;
};
