import { pool } from "../config/db.js";

class ProductModel {
  // ดึงสินค้าทั้งหมด
  static async getAllProducts() {
    const [rows] = await pool.query(`
      SELECT
        p.id,
        p.sku,
        p.name,
        p.brand,
        p.description,
        p.price,
        p.stock,
        p.warranty,
        p.image,
        p.featured,
        p.status,
        c.name AS category
      FROM products p
      JOIN categories c
      ON p.category_id = c.id
      WHERE p.status = 'active'
      ORDER BY p.id DESC
    `);

    return rows;
  }

  // ดึงสินค้าตาม id
  static async getProductById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        p.*,
        c.name AS category
      FROM products p
      JOIN categories c
      ON p.category_id = c.id
      WHERE p.id = ?
      `,
      [id],
    );

    return rows[0];
  }

  // ดึงหมวดหมู่ทั้งหมด
  static async getCategories() {
    const [rows] = await pool.query(`
      SELECT *
      FROM categories
      ORDER BY name ASC
    `);

    return rows;
  }

  // ดึงสินค้าตามหมวด
  static async getProductsByCategory(categoryId) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM products
      WHERE category_id = ?
      AND status = 'active'
      `,
      [categoryId],
    );

    return rows;
  }
}

export default ProductModel;
