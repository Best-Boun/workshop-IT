import api from "../api/axios";

// ===============================
// Products
// ===============================

// ดึงสินค้าทั้งหมด
export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data.data;
};

// ดึงสินค้าตาม id
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

// เพิ่มสินค้า
export const createProduct = async (product) => {
  const response = await api.post("/products", product);
  return response.data;
};

// แก้ไขสินค้า
export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

// ลบสินค้า
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// ดึงสินค้าที่ใกล้หมด
export const getLowStockProducts = async () => {
  const response = await api.get("/products/low-stock");
  return response.data.data;
};

// ===============================
// Categories
// ===============================

// ดึงหมวดหมู่ทั้งหมด
export const getCategories = async () => {
  const response = await api.get("/products/categories/all");
  return response.data.data;
};
