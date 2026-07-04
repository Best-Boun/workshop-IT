import axios from "axios";

const API_URL = "http://localhost:5000/api/categories";

// ===============================
// Categories
// ===============================

// ดึงหมวดหมู่ทั้งหมด
export const getAllCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

// ดึงหมวดหมู่ตาม id
export const getCategory = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

// เพิ่มหมวดหมู่
export const createCategory = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// แก้ไขหมวดหมู่
export const updateCategory = async (id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ลบหมวดหมู่
export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
