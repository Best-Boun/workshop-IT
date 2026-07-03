import { pool } from "../config/db.js";

class UserModel {
  // ค้นหาผู้ใช้ด้วย Email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    return rows[0] || null;
  }

  // ค้นหาผู้ใช้ด้วย ID
  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id],
    );

    return rows[0] || null;
  }

  // เพิ่มผู้ใช้ใหม่
  static async create(userData) {
    const {
      first_name,
      last_name,
      email,
      password,
      google_id = null,
      profile_image = null,
      role = "user",
    } = userData;

    const [result] = await pool.execute(
      `
      INSERT INTO users
      (
        first_name,
        last_name,
        email,
        password,
        google_id,
        profile_image,
        role
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [first_name, last_name, email, password, google_id, profile_image, role],
    );

    return result.insertId;
  }
}

export default UserModel;
