import express from "express";
import OrderController from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// POST   /api/orders           →  Checkout (create order)
router.post("/", authMiddleware, OrderController.createOrder);

// GET    /api/orders/my        →  Order history (user's own orders)
router.get("/my", authMiddleware, OrderController.getMyOrders);

// GET    /api/orders           →  All orders (admin only)
router.get("/", authMiddleware, adminMiddleware, OrderController.getAllOrders);

// GET    /api/orders/:id       →  Track order
router.get("/:id", authMiddleware, OrderController.getOrderById);

// PUT    /api/orders/:id/status →  Update order status (admin only)
router.put("/:id/status", authMiddleware, adminMiddleware, OrderController.updateOrderStatus);

// PUT    /api/orders/:id/cancel →  Cancel order (user)
router.put("/:id/cancel", authMiddleware, OrderController.cancelOrder);

export default router;
