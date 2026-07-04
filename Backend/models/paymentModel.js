import { pool } from "../config/db.js";

class PaymentModel {
  // สร้าง payment record
  static async createPayment({
    order_id,
    amount,
    payment_method,
    transaction_id,
    status,
  }) {
    const [result] = await pool.execute(
      `INSERT INTO payments (order_id, amount, payment_method, transaction_id, payment_status, paid_at)
       VALUES (?, ?, ?, ?, ?, IF(? = 'completed', NOW(), NULL))`,
      [order_id, amount, payment_method, transaction_id, status, status],
    );
    return result.insertId;
  }

  // ดึง payment ตาม order_id
  static async getPaymentByOrderId(orderId) {
    const [rows] = await pool.query(
      `SELECT *, payment_status AS status FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1`,
      [orderId],
    );
    return rows[0];
  }

  // อัปเดต payment status
  static async updatePaymentStatus(paymentId, status, transactionId) {
    await pool.execute(
      `UPDATE payments SET payment_status = ?, transaction_id = ?,
       paid_at = IF(? = 'completed', NOW(), paid_at) WHERE id = ?`,
      [status, transactionId, status, paymentId],
    );
  }
}

export default PaymentModel;
