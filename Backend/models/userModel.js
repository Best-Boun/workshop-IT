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

  // ดึง admins และ superadmins
  static async getAdmins() {
    const [rows] = await pool.execute(
      "SELECT id, first_name, last_name, email, role, permissions FROM users WHERE role IN ('admin', 'superadmin') ORDER BY role DESC, first_name ASC",
    );

    return rows;
  }

  // ลบผู้ใช้
  static async deleteById(id) {
    const [result] = await pool.execute(
      "DELETE FROM users WHERE id = ?",
      [id],
    );

    return result.affectedRows;
  }

  // อัปเดต permissions ของผู้ใช้
  static async updatePermissions(id, permissions) {
    const [result] = await pool.execute(
      "UPDATE users SET permissions = ? WHERE id = ?",
      [JSON.stringify(permissions), id],
    );

    return result.affectedRows;
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
      permissions = {},
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
        role,
        permissions
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        first_name,
        last_name,
        email,
        password,
        google_id,
        profile_image,
        role,
        JSON.stringify(permissions),
      ],
    );

    return result.insertId;
  }
}

export default UserModel;
