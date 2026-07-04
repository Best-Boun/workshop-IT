import { pool } from "../config/db.js";

class OrderModel {
  // สร้าง order พร้อม items (transaction)
  static async createOrder(
    userId,
    {
      items,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      total_amount,
    },
  ) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [orderResult] = await conn.execute(
        `INSERT INTO orders
          (user_id, total_price, shipping_address, shipping_city, shipping_postal_code, shipping_country)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          total_amount,
          shipping_address,
          shipping_city,
          shipping_postal_code,
          shipping_country,
        ],
      );

      const orderId = orderResult.insertId;

      for (const item of items) {
        await conn.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [
            orderId,
            item.product_id,
            item.quantity,
            item.price,
            item.quantity * item.price,
          ],
        );

        await conn.execute(
          `UPDATE products
           SET stock = GREATEST(stock - ?, 0)
           WHERE id = ?`,
          [item.quantity, item.product_id],
        );
      }

      await conn.commit();
      return orderId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // ดึง Order ตาม ID
  static async getOrderById(orderId) {
    const [rows] = await pool.query(
      `SELECT
        o.*,
        o.total_price AS total_amount,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        u.email AS customer_email,
        u.first_name,
        u.last_name,
        u.email
     FROM orders o
     JOIN users u
       ON o.user_id = u.id
     WHERE o.id = ?`,
      [orderId],
    );

    if (!rows.length) return null;

    const order = rows[0];

    const [items] = await pool.query(
      `SELECT
        oi.*,
        p.name AS product_name,
        p.image AS product_image,
        p.brand
     FROM order_items oi
     JOIN products p
       ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
      [orderId],
    );

    order.items = items;

    return order;
  }

  // ดึง orders ของ user (order history)
  static async getOrdersByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT
          o.*,
          o.total_price AS total_amount,
          COUNT(oi.id) AS item_count,
          p.payment_status,
          p.payment_method,
          p.transaction_id
       FROM orders o
       LEFT JOIN order_items oi
         ON o.id = oi.order_id
       LEFT JOIN payments p
         ON o.id = p.order_id
        AND p.payment_status = 'completed'
       WHERE o.user_id = ?
       GROUP BY o.id, p.payment_status, p.payment_method, p.transaction_id
       ORDER BY o.created_at DESC`,
      [userId],
    );

    return rows;
  }

  // Admin : All Orders
  static async getAllOrders() {
    const [rows] = await pool.query(
      `SELECT
        o.*,
        o.total_price AS total_amount,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(oi.id) AS item_count
     FROM orders o
     JOIN users u
       ON o.user_id = u.id
     LEFT JOIN order_items oi
       ON o.id = oi.order_id
     GROUP BY
       o.id,
       u.first_name,
       u.last_name,
       u.email
     ORDER BY o.created_at DESC`,
    );

    return rows;
  }

  // Update Status
  static async updateOrderStatus(orderId, status) {
    await pool.execute(
      `UPDATE orders
       SET status = ?
       WHERE id = ?`,
      [status, orderId],
    );

    return {
      id: orderId,
      status,
    };
  }

  // Delete Order
  static async deleteOrder(orderId) {
    const [result] = await pool.execute(
      `DELETE FROM orders
       WHERE id = ?`,
      [orderId],
    );

    return result;
  }
}

export default OrderModel;
