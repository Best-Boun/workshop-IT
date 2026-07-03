import { pool } from "../config/db.js";

class PaymentModel {
  // สร้าง payment record
  static async createPayment({
    order_id,
    user_id,
    amount,
    payment_method,
    transaction_id,
    status,
  }) {
    const [result] = await pool.execute(
      `INSERT INTO payments (order_id, user_id, amount, payment_method, transaction_id, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [order_id, user_id, amount, payment_method, transaction_id, status],
    );
    return result.insertId;
  }

  // ดึง payment ตาม order_id
  static async getPaymentByOrderId(orderId) {
    const [rows] = await pool.query(
      `SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1`,
      [orderId],
    );
    return rows[0];
  }

  // อัปเดต payment status
  static async updatePaymentStatus(paymentId, status, transactionId) {
    await pool.execute(
      `UPDATE payments SET status = ?, transaction_id = ? WHERE id = ?`,
      [status, transactionId, paymentId],
    );
  }
}

export default PaymentModel;
