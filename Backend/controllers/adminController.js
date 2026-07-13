import UserModel from "../models/userModel.js";
import { pool } from "../config/db.js";

class AdminController {
  // ==========================
  // GET /api/admin/stats  →  Dashboard summary
  // ==========================
  static async getStats(req, res) {
    try {
      // Orders summary
      const [[orderStats]] = await pool.query(`
        SELECT
          COUNT(*) AS total_orders,
          COALESCE(SUM(total_price), 0) AS total_revenue,
          SUM(status = 'pending')    AS pending_count,
          SUM(status = 'processing') AS processing_count,
          SUM(status = 'shipped')    AS shipped_count,
          SUM(status = 'delivered')  AS delivered_count,
          SUM(status = 'cancelled')  AS cancelled_count
        FROM orders
      `);

      const [[todayRevenue]] = await pool.query(`
        SELECT COALESCE(SUM(amount), 0) AS today_revenue
        FROM payments
        WHERE payment_status = 'completed'
          AND DATE(created_at) = CURDATE()
      `);

      const [[monthlyRevenue]] = await pool.query(`
        SELECT COALESCE(SUM(amount), 0) AS monthly_revenue
        FROM payments
        WHERE payment_status = 'completed'
          AND YEAR(created_at) = YEAR(CURDATE())
          AND MONTH(created_at) = MONTH(CURDATE())
      `);

      // Users summary
      const [[userStats]] = await pool.query(`
        SELECT COUNT(*) AS total_users FROM users WHERE role = 'user'
      `);

      // Products summary
      const [[productStats]] = await pool.query(`
        SELECT
          COUNT(*) AS total_products,
          SUM(stock <= 5 AND stock > 0) AS low_stock,
          SUM(stock = 0) AS out_of_stock,
          COALESCE(SUM(price * stock), 0) AS inventory_value
        FROM products
      `);

      // Payments summary
      const [[paymentStats]] = await pool.query(`
        SELECT
          COALESCE(SUM(amount), 0) AS total_revenue,
          SUM(payment_status = 'completed') AS completed,
          SUM(payment_status = 'pending')   AS pending,
          SUM(payment_status = 'failed')    AS failed,
          SUM(payment_status = 'refunded')  AS refunded
        FROM payments
      `);

      const [[totalPaid]] = await pool.query(`
        SELECT COALESCE(SUM(amount), 0) AS total_paid
        FROM payments WHERE payment_status = 'completed'
      `);

      const orders = {
        total_orders: Number(orderStats.total_orders),
        total_revenue: Number(orderStats.total_revenue),
        today_revenue: Number(todayRevenue.today_revenue),
        monthly_revenue: Number(monthlyRevenue.monthly_revenue),
        pending: Number(orderStats.pending_count),
        pending_count: Number(orderStats.pending_count),
        processing: Number(orderStats.processing_count),
        processing_count: Number(orderStats.processing_count),
        shipped: Number(orderStats.shipped_count),
        shipped_count: Number(orderStats.shipped_count),
        delivered: Number(orderStats.delivered_count),
        delivered_count: Number(orderStats.delivered_count),
        cancelled: Number(orderStats.cancelled_count),
        cancelled_count: Number(orderStats.cancelled_count),
      };

      const payments = {
        total_revenue: Number(paymentStats.total_revenue),
        total_paid: Number(totalPaid.total_paid),
        today_revenue: Number(todayRevenue.today_revenue),
        monthly_revenue: Number(monthlyRevenue.monthly_revenue),
        completed: Number(paymentStats.completed),
        pending: Number(paymentStats.pending),
        failed: Number(paymentStats.failed),
        failed_count: Number(paymentStats.failed),
        refunded: Number(paymentStats.refunded),
      };

      return res.status(200).json({
        success: true,
        data: {
          orders,
          users: { total_users: Number(userStats.total_users) },
          products: {
            total_products: Number(productStats.total_products),
            low_stock: Number(productStats.low_stock || 0),
            out_of_stock: Number(productStats.out_of_stock || 0),
            inventory_value: Number(productStats.inventory_value || 0),
          },
          payments,
        },
      });
    } catch (error) {
      console.error("getStats error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
  }

  // ==========================
  // GET /api/admin/top-products
  // ==========================
  static async getTopProducts(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT
          p.id AS product_id,
          p.name AS product_name,
          p.brand,
          p.price,
          SUM(oi.quantity) AS total_sold,
          SUM(oi.quantity * oi.price) AS total_revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status != 'cancelled'
        GROUP BY p.id, p.name, p.brand, p.price
        ORDER BY total_sold DESC
        LIMIT 10
      `);

      return res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("getTopProducts error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch top products" });
    }
  }

  // ==========================
  // GET /api/admin/payment-methods
  // ==========================
  static async getPaymentMethods(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT
          payment_method AS method,
          COUNT(*) AS transaction_count,
          COALESCE(SUM(amount), 0) AS total_revenue
        FROM payments
        WHERE payment_status = 'completed'
        GROUP BY payment_method
        ORDER BY total_revenue DESC
      `);

      return res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("getPaymentMethods error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch payment methods" });
    }
  }

  static async getAdmins(req, res) {
    try {
      const admins = await UserModel.getAdmins();

      const response = admins.map((admin) => ({
        ...admin,
        permissions: admin.permissions ? JSON.parse(admin.permissions) : {},
      }));

      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      console.error("getAdmins error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch admin users" });
    }
  }

  static async deleteAdmin(req, res) {
    try {
      const { id } = req.params;

      if (req.user.id === Number(id)) {
        return res
          .status(400)
          .json({ success: false, message: "You cannot delete yourself" });
      }

      const affectedRows = await UserModel.deleteById(id);

      if (!affectedRows) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }

      return res.status(200).json({ success: true, message: "Admin deleted" });
    } catch (error) {
      console.error("deleteAdmin error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete admin" });
    }
  }

  static async promoteToAdmin(req, res) {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ success: false, message: "Email is required" });
      }

      const result = await UserModel.promoteToAdmin(email.trim().toLowerCase());

      if (result.error === "not_found") {
        return res
          .status(404)
          .json({ success: false, message: "ไม่พบผู้ใช้งานที่มีอีเมลนี้ในระบบ" });
      }
      if (result.error === "already_admin") {
        return res
          .status(400)
          .json({ success: false, message: "ผู้ใช้งานนี้เป็นแอดมินอยู่แล้ว" });
      }

      return res.status(200).json({
        success: true,
        message: "เพิ่มแอดมินย่อยสำเร็จ",
        data: {
          id: result.user.id,
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          email: result.user.email,
          role: "admin",
          permissions: result.defaultPermissions,
        },
      });
    } catch (error) {
      console.error("promoteToAdmin error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to promote user to admin" });
    }
  }

  static async updateAdminPermissions(req, res) {
    try {
      const { id } = req.params;
      const { permissions } = req.body;

      if (!permissions || typeof permissions !== "object") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid permissions payload" });
      }

      const affectedRows = await UserModel.updatePermissions(id, permissions);

      if (!affectedRows) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }

      return res.status(200).json({ success: true, message: "Permissions updated" });
    } catch (error) {
      console.error("updateAdminPermissions error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update permissions" });
    }
  }
}

export default AdminController;
