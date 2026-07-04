import express from "express";
import OrderController from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ================= USER =================

// Checkout
router.post("/", authMiddleware, OrderController.createOrder);

// Order History
router.get("/my", authMiddleware, OrderController.getMyOrders);

// Track Order
router.get("/:id", authMiddleware, OrderController.getOrderById);

// Cancel Order
router.put("/:id/cancel", authMiddleware, OrderController.cancelOrder);

// ================= ADMIN =================

// All Orders
router.get("/", authMiddleware, adminMiddleware, OrderController.getAllOrders);

// Update Status
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  OrderController.updateOrderStatus,
);

// Delete Order
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  OrderController.deleteOrder,
);

export default router;
