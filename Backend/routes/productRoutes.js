import express from "express";
import ProductController from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ดึงสินค้าทั้งหมด
router.get("/", ProductController.getAllProducts);

// ค้นหาสินค้า
router.get("/search", ProductController.searchProducts);

// ดึงหมวดหมู่ทั้งหมด
router.get("/categories/all", ProductController.getCategories);

// ดึงสินค้าตามหมวด
router.get("/category/:id", ProductController.getProductsByCategory);

// ดึงรายละเอียดสินค้า
router.get("/:id", ProductController.getProductById);

// เพิ่มสินค้า
router.post("/", upload.single("image"), ProductController.createProduct);

// แก้ไขสินค้า
router.put("/:id", upload.single("image"), ProductController.updateProduct);

// ลบสินค้า
router.delete("/:id", ProductController.deleteProduct);

export default router;
