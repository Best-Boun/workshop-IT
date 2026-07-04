import { pool } from "../config/db.js";

class CategoryModel {
  // ดึงหมวดหมู่ทั้งหมด
  static async getAllCategories() {
    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        image,
        created_at,
        updated_at
      FROM categories
      ORDER BY id DESC
    `);

    return rows;
  }

  // ดึงหมวดหมู่ตาม id
  static async getCategoryById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        name,
        image,
        created_at,
        updated_at
      FROM categories
      WHERE id = ?
      `,
      [id],
    );

    return rows[0];
  }

  // เพิ่มหมวดหมู่
  static async createCategory(category) {
    const { name, image } = category;

    const [result] = await pool.query(
      `
      INSERT INTO categories
      (
        name,
        image,
        created_at,
        updated_at
      )
      VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      [name, image],
    );

    return {
      id: result.insertId,
      ...category,
    };
  }

  // แก้ไขหมวดหมู่
  static async updateCategory(id, category) {
    const { name, image } = category;

    if (image) {
      await pool.query(
        `
      UPDATE categories
      SET
        name = ?,
        image = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
        [name, image, id],
      );
    } else {
      await pool.query(
        `
      UPDATE categories
      SET
        name = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
        [name, id],
      );
    }

    return {
      id,
      ...category,
    };
  }

  // ลบหมวดหมู่
  static async deleteCategory(id) {
    const [result] = await pool.query(
      `
      DELETE FROM categories
      WHERE id = ?
      `,
      [id],
    );

    return result;
  }
}

export default CategoryModel;
