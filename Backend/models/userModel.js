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

  // ดึงข้อมูลโปรไฟล์ของผู้ใช้สำหรับหน้า My Profile
  static async getProfileById(id) {
    const [rows] = await pool.execute(
      `SELECT
         id,
         first_name,
         last_name,
         email,
         phone,
         address,
         profile_image,
         role,
         google_id,
         updated_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id],
    );

    return rows[0] || null;
  }

  // อัปเดตข้อมูลโปรไฟล์ (ห้ามแก้ email)
  static async updateProfileById(id, profileData) {
    const {
      first_name,
      last_name,
      phone = null,
      address = null,
    } = profileData;

    const [result] = await pool.execute(
      `UPDATE users
       SET
         first_name = ?,
         last_name = ?,
         phone = ?,
         address = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [first_name, last_name, phone, address, id],
    );

    return result.affectedRows;
  }

  static async updatePasswordById(id, hashedPassword) {
    const [result] = await pool.execute(
      `UPDATE users
       SET
         password = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [hashedPassword, id],
    );

    return result.affectedRows;
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

  // เลื่อน user ธรรมดาเป็น admin ย่อย
  static async promoteToAdmin(email) {
    const [rows] = await pool.execute(
      "SELECT id, first_name, last_name, email, role FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    const user = rows[0];
    if (!user) return { error: "not_found" };
    if (user.role === "admin" || user.role === "superadmin") return { error: "already_admin" };

    const defaultPermissions = {
      dashboard: { view: false, manage: false },
      products: { view: false, manage: false },
      categories: { view: false, manage: false },
      orders: { view: false, manage: false },
      customers: { view: false, manage: false },
      reports: { view: false, manage: false },
      logsSecurity: { view: false, manage: false },
      adminManagement: { view: false, manage: false },
    };

    await pool.execute(
      "UPDATE users SET role = 'admin', permissions = ? WHERE id = ?",
      [JSON.stringify(defaultPermissions), user.id],
    );

    return { success: true, user, defaultPermissions };
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
