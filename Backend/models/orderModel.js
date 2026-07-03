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
          (user_id, total_amount, shipping_address, shipping_city, shipping_postal_code, shipping_country)
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
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price],
        );

        // หักสต็อกสินค้า
        await conn.execute(
          `UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?`,
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

  // ดึง order ตาม id พร้อม items
  static async getOrderById(orderId) {
    const [rows] = await pool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [orderId],
    );

    if (!rows[0]) return null;

    const order = rows[0];

    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.image, p.brand
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId],
    );

    order.items = items;
    return order;
  }

  // ดึง orders ของ user (order history)
  static async getOrdersByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT o.*, COUNT(oi.id) AS item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId],
    );
    return rows;
  }

  // ดึง orders ทั้งหมด (admin)
  static async getAllOrders() {
    const [rows] = await pool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email, COUNT(oi.id) AS item_count
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
    );
    return rows;
  }

  // อัปเดต status
  static async updateOrderStatus(orderId, status) {
    await pool.execute(`UPDATE orders SET status = ? WHERE id = ?`, [
      status,
      orderId,
    ]);
  }
}

export default OrderModel;
