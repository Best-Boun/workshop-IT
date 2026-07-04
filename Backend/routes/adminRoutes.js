import express from "express";
import AdminController from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

const router = express.Router();

// ─── Stats & Analytics ───────────────────────────────────────────
// GET /api/admin/stats             → Dashboard summary (revenue, orders, users, products, payments)
router.get("/stats", authMiddleware, adminOnly, AdminController.getStats);

// GET /api/admin/top-products      → Top 10 best-selling products
router.get("/top-products", authMiddleware, adminOnly, AdminController.getTopProducts);

// GET /api/admin/payment-methods   → Payment method breakdown
router.get("/payment-methods", authMiddleware, adminOnly, AdminController.getPaymentMethods);

// ─── Admin User Management ───────────────────────────────────────
// GET /api/admin → ดึงรายการแอดมินและ superadmin
router.get("/", authMiddleware, adminOnly, AdminController.getAdmins);

// DELETE /api/admin/:id → ลบแอดมิน
router.delete("/:id", authMiddleware, adminOnly, AdminController.deleteAdmin);

// PUT /api/admin/:id/permissions → อัปเดต permissions
router.put("/:id/permissions", authMiddleware, adminOnly, AdminController.updateAdminPermissions);

export default router;
