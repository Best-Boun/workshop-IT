import express from "express";
import ProductController from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ===============================
// Products (Admin)
// ===============================

// ดึงสินค้าทั้งหมด (Admin เห็นทุกสินค้า)
router.get("/", ProductController.getAllProducts);

// ดึงสินค้าสำหรับหน้าร้าน (Customer เห็นเฉพาะ Active)
router.get("/store", ProductController.getStoreProducts);

// ค้นหาสินค้า
router.get("/search", ProductController.searchProducts);

// ดึงหมวดหมู่ทั้งหมด
router.get("/categories/all", ProductController.getCategories);

// ดึง Brand
router.get("/brands", ProductController.getBrands);

// ดึงสินค้าตามหมวด
router.get("/category/:id", ProductController.getProductsByCategory);

// ดึงสินค้าที่ใกล้หมด
router.get("/low-stock", ProductController.getLowStockProducts);

// ดึงรายละเอียดสินค้า
router.get("/:id", ProductController.getProductById);

// ===============================
// CRUD
// ===============================

// เพิ่มสินค้า
router.post("/", upload.single("image"), ProductController.createProduct);

// แก้ไขสินค้า
router.put("/:id", upload.single("image"), ProductController.updateProduct);

// เปลี่ยนสถานะสินค้า
router.patch("/:id/status", ProductController.toggleProductStatus);

// ลบสินค้า
router.delete("/:id", ProductController.deleteProduct);



export default router;
