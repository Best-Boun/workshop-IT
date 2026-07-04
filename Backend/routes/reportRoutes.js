import express from "express";
import ReportController from "../controllers/reportController.js";

const router = express.Router();

// ดึงสรุปรายงานแผงควบคุม
router.get("/dashboard", ReportController.getDashboardSummary);

// ดึงรายงานยอดขายตามเดือน
router.get("/sales", ReportController.getMonthlySales);

// ดึงรายงานสินค้าขายดี
router.get("/products", ReportController.getTopProducts);

// ดึงรายงานลูกค้า
router.get("/customers", ReportController.getCustomerReport);

router.get("/orders", ReportController.getRecentOrders);
router.get("/status", ReportController.getOrderStatusReport);

export default router;
