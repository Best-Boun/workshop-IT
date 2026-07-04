import PaymentModel from "../models/paymentModel.js";
import OrderModel from "../models/orderModel.js";
import { pool } from "../config/db.js";

class PaymentController {
  // ==========================
  // POST /api/payments/process  →  Payment simulation
  // ==========================
  static async processPayment(req, res) {
    try {
      const userId = req.user.id;
      const { order_id, payment_method, card_number } = req.body;

      if (!order_id || !payment_method) {
        return res.status(400).json({
          success: false,
          message: "order_id and payment_method are required",
        });
      }

      const order = await OrderModel.getOrderById(order_id);

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      if (order.user_id !== userId) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      if (order.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Cannot pay for a cancelled order",
        });
      }

      // ตรวจสอบว่าชำระเงินแล้วหรือยัง
      const existingPayment = await PaymentModel.getPaymentByOrderId(order_id);
      console.log(existingPayment);
      if (existingPayment && existingPayment.status === "completed") {
        return res.status(400).json({
          success: false,
          message: "This order has already been paid",
        });
      }

      // Simulation: card ending in 0002 → decline (test failure card)
      const lastFour = card_number ? card_number.replace(/\s/g, "").slice(-4) : "1111";
      console.log("CARD:", card_number);
console.log("LAST4:", lastFour);
      const isDeclined = lastFour === "0002";

      const transactionId = `TXN-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase()}`;

      const paymentStatus = isDeclined ? "failed" : "completed";

      const paymentId = await PaymentModel.createPayment({
        order_id,
        amount: order.total_amount,
        payment_method,
        transaction_id: transactionId,
        status: paymentStatus,
      });

      if (!isDeclined) {
        console.log("STATUS TO UPDATE =", "Paid");
        const [rows] = await pool.query("SHOW COLUMNS FROM orders LIKE 'status'");
console.log(rows);
        await OrderModel.updateOrderStatus(order_id, "Processing");
      }

      return res.status(200).json({
        success: !isDeclined,
        message: isDeclined ? "Payment declined" : "Payment successful",
        data: {
          paymentId,
          transactionId,
          status: paymentStatus,
          amount: order.total_amount,
        },
      });
    } catch (error) {
      console.error("processPayment error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Payment processing error" });
    }
  }

  // ==========================
  // GET /api/payments/:orderId  →  Get payment status
  // ==========================
  static async getPaymentStatus(req, res) {
    try {
      const { orderId } = req.params;
      const payment = await PaymentModel.getPaymentByOrderId(orderId);

      if (!payment) {
        return res
          .status(404)
          .json({ success: false, message: "Payment not found" });
      }

      return res.status(200).json({ success: true, data: payment });
    } catch (error) {
      console.error("getPaymentStatus error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch payment status" });
    }
  }
}

export default PaymentController;
