import express from "express";
import ReportController from "../controllers/reportController.js";

const router = express.Router();

// ดึงสรุปรายงานแผงควบคุม
router.get("/dashboard", ReportController.getDashboardSummary);

// ดึงรายงานกราฟรายได้ตามช่วงเวลา
router.get("/chart", ReportController.getRevenueChart);

// ดึงรายงานยอดขายตามเดือน
router.get("/sales", ReportController.getMonthlySales);

// ดึงรายงานสินค้าขายดี
router.get("/products", ReportController.getTopProducts);

// ดึงรายงานลูกค้า
router.get("/customers", ReportController.getCustomerReport);

router.get("/orders", ReportController.getRecentOrders);
router.get("/status", ReportController.getOrderStatusReport);
router.get("/payment", ReportController.getPaymentAnalytics);

export default router;
