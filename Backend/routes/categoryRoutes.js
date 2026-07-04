import express from "express";
import CategoryController from "../controllers/categoryController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ดึงหมวดหมู่ทั้งหมด
router.get("/", CategoryController.getAllCategories);

// ดึงรายละเอียดหมวดหมู่
router.get("/:id", CategoryController.getCategoryById);

// เพิ่มหมวดหมู่
router.post("/", upload.single("image"), CategoryController.createCategory);

// แก้ไขหมวดหมู่
router.put("/:id", upload.single("image"), CategoryController.updateCategory);

// ลบหมวดหมู่
router.delete("/:id", CategoryController.deleteCategory);

export default router;
