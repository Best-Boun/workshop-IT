import express from "express";
import ProductController from "../controllers/productController.js";

const router = express.Router();

// ดึงสินค้าทั้งหมด
router.get("/", ProductController.getAllProducts);

// ดึงสินค้าตามหมวด
router.get("/category/:id", ProductController.getProductsByCategory);

// ดึงรายละเอียดสินค้า
router.get("/:id", ProductController.getProductById);

export default router;
