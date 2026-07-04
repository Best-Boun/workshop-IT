import { pool } from "../config/db.js";

class ReportModel {
  // Dashboard Summary
  static async getDashboardSummary() {
    const [summary] = await pool.query(`
      SELECT
        COALESCE(SUM(total_price), 0) AS total_revenue,
        COUNT(*) AS total_orders,
        (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_customers,
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COALESCE(AVG(total_price), 0) FROM orders WHERE status = 'Completed') AS average_order_value,
        (SELECT COUNT(*) FROM orders WHERE status = 'Pending') AS pending_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'Completed') AS completed_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'Cancelled') AS cancelled_orders
      FROM orders
    `);

    return summary[0];
  }

  // Monthly Sales
  static async getMonthlySales() {
    const [rows] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        SUM(total_price) AS revenue,
        COUNT(*) AS order_count
      FROM orders
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    return rows;
  }

  // Top Selling Products
  static async getTopProducts() {
    const [rows] = await pool.query(`
      SELECT
        p.name AS product_name,
        SUM(oi.quantity) AS quantity_sold,
        SUM(oi.subtotal) AS revenue
      FROM order_items oi
      JOIN products p
      ON oi.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY quantity_sold DESC, revenue DESC
      LIMIT 10
    `);

    return rows;
  }

  // Customer Report
  static async getCustomerReport() {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total_customers,
        SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) AS verified_customers,
        SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) AS new_customers_this_month
      FROM users
      WHERE role = 'user'
    `);

    const [topCustomers] = await pool.query(`
      SELECT
        CONCAT(first_name, ' ', last_name) AS customer_name,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.total_price), 0) AS total_spending
      FROM users u
      LEFT JOIN orders o
      ON u.id = o.user_id
      WHERE u.role = 'user'
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY total_spending DESC, total_orders DESC
      LIMIT 5
    `);

    return {
      ...rows[0],
      top_customers: topCustomers,
    };
  }

  // Recent Orders
  static async getRecentOrders() {
    const [rows] = await pool.query(`
      SELECT
        o.id AS order_id,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        o.status,
        o.total_price AS total,
        o.created_at AS created_date
      FROM orders o
      LEFT JOIN users u
      ON o.user_id = u.id
      ORDER BY o.id DESC
      LIMIT 10
    `);

    return rows;
  }

  // Order Status Report
  static async getOrderStatusReport() {
    const [rows] = await pool.query(`
      SELECT
        status,
        COUNT(*) AS count
      FROM orders
      GROUP BY status
    `);

    const statusMap = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Completed: 0,
      Cancelled: 0,
    };

    rows.forEach((row) => {
      if (statusMap[row.status] !== undefined) {
        statusMap[row.status] = row.count;
      }
    });

    return statusMap;
  }
}

export default ReportModel;
