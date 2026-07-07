import OrderModel from "../models/orderModel.js";
import PaymentModel from "../models/paymentModel.js";
import UserModel from "../models/userModel.js";

class OrderController {
  // ==========================
  // POST /api/orders  →  Checkout (create order)
  // ==========================
  static async createOrder(req, res) {
  try {
    console.log("===== CREATE ORDER =====");

    const userId = req.user.id;
      const {
        items,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        shipping_country,
        total_amount,
      } = req.body;

      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Cart is empty" });
      }

      if (!shipping_address || !shipping_city || !shipping_country) {
        return res
          .status(400)
          .json({ success: false, message: "Shipping address is required" });
      }

      const profile = await UserModel.getProfileById(userId);

      if (!profile) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const shipping_name = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
      const shipping_phone = profile.phone ? String(profile.phone) : null;
      const shipping_address_snapshot = profile.address || shipping_address;

      const orderId = await OrderModel.createOrder(userId, {
        items,
        shipping_name,
        shipping_phone,
        shipping_address: shipping_address_snapshot,
        shipping_city,
        shipping_postal_code,
        shipping_country,
        total_amount,
      });
      console.log("NEW ORDER ID:", orderId);

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: { orderId },
      });
    } catch (error) {
      console.error("createOrder error:", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Failed to create order" });
    }
  }

  // ==========================
  // GET /api/orders/my  →  Order history
  // ==========================
  static async getMyOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await OrderModel.getOrdersByUserId(userId);

      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      console.error("getMyOrders error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch orders" });
    }
  }

  // ==========================
  // GET /api/orders/:id  →  Track order
  // ==========================
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderModel.getOrderById(id);

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      if (order.user_id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const payment = await PaymentModel.getPaymentByOrderId(id);
      order.payment = payment || null;

      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error("getOrderById error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch order" });
    }
  }

  // ==========================
  // GET /api/orders  →  Admin: all orders
  // ==========================
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.getAllOrders();

      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      console.error("getAllOrders error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch orders" });
    }
  }

  // ==========================
  // PUT /api/orders/:id/status  →  Admin: update status
  // ==========================
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status value" });
      }

      const result = await OrderModel.updateOrderStatus(id, status);

      return res.status(200).json({
        success: true,
        message: "Order status updated",
        data: result,
      });
    } catch (error) {
      console.error("updateOrderStatus error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update order status" });
    }
  }

  // ==========================
  // PUT /api/orders/:id/cancel  →  User: cancel own order
  // ==========================
  static async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderModel.getOrderById(id);

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      if (order.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      if (!["Pending", "Processing"].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel order at this stage",
        });
      }

      await OrderModel.updateOrderStatus(id, "cancelled");

      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
      });
    } catch (error) {
      console.error("cancelOrder error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to cancel order" });
    }
  }

  // ==========================
  // DELETE /api/orders/:id
  // ==========================
  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;

      await OrderModel.deleteOrder(id);

      return res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error) {
      console.error("deleteOrder error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete order" });
    }
  }
}

export default OrderController;
