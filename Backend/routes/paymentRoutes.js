import express from "express";
import PaymentController from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST  /api/payments/process     →  Process payment (simulation)
router.post("/process", authMiddleware, PaymentController.processPayment);

// GET   /api/payments/:orderId    →  Get payment status
router.get("/:orderId", authMiddleware, PaymentController.getPaymentStatus);

export default router;
