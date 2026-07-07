import { pool } from "../config/db.js";

class CustomerModel {
  // ดึงลูกค้าทั้งหมด
  static async getAllCustomers() {
    const [rows] = await pool.query(`
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        CONCAT(u.first_name, ' ', u.last_name) AS full_name,
        u.email,
        u.role,
        u.is_verified,
        u.created_at,
        u.updated_at
      FROM users u
      WHERE u.role = 'user'
      ORDER BY u.id DESC
    `);

    return rows;
  }

  // ดึงลูกค้าตาม id
  static async getCustomerById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        CONCAT(u.first_name, ' ', u.last_name) AS full_name,
        u.email,
        u.role,
        u.is_verified,
        u.created_at,
        u.updated_at
      FROM users u
      WHERE u.id = ?
      `,
      [id],
    );

    if (!rows[0]) {
      return null;
    }

    const [orderStats] = await pool.query(
      `
      SELECT
        COUNT(*) AS total_orders,
        COALESCE(SUM(total_price), 0) AS total_spending,
        MAX(created_at) AS latest_order_date
      FROM orders
      WHERE user_id = ?
      `,
      [id],
    );

    const [recentOrders] = await pool.query(
      `
      SELECT
  o.id,
  o.status,
  o.total_price,
  o.created_at,

  p.payment_method,
  p.payment_status

FROM orders o

LEFT JOIN payments p
ON o.id = p.order_id

WHERE o.user_id = ?

ORDER BY o.id DESC

LIMIT 5
      `,
      [id],
    );

    return {
      ...rows[0],
      ...orderStats[0],
      recent_orders: recentOrders,
    };
  }

  // แก้ไขลูกค้า
  static async updateCustomer(id, customer) {
    const { first_name, last_name, email, role, is_verified } = customer;

    await pool.query(
      `
      UPDATE users
      SET
        first_name = ?,
        last_name = ?,
        email = ?,
        role = ?,
        is_verified = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [first_name, last_name, email, role, is_verified, id],
    );

    return {
      id,
      ...customer,
    };
  }

  // ลบลูกค้า
  static async deleteCustomer(id) {
    const [result] = await pool.query(
      `
     DELETE FROM users
WHERE id = ?
AND role = 'user'
      `,
      [id],
    );

    return result;
  }
}

export default CustomerModel;
