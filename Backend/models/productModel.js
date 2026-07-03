import { pool } from "../config/db.js";

class ProductModel {
  // ดึงสินค้าทั้งหมด
  static async getAllProducts(filters = {}) {
    const { category, brand } = filters;

    const whereConditions = ["p.status = 'active'"];
    const params = [];

    if (category) {
      whereConditions.push("c.name = ?");
      params.push(category);
    }

    if (brand) {
      whereConditions.push("p.brand = ?");
      params.push(brand);
    }

    const whereClause = whereConditions.join(" AND ");

    const [rows] = await pool.query(
      `
      SELECT
        p.id,
        p.sku,
        p.name,
        p.brand,
        p.description,
        p.price,
        p.stock,
        p.warranty,
        p.warranty_provider,
        p.image,
        p.featured,
        p.status,
        c.name AS category
      FROM products p
      JOIN categories c
      ON p.category_id = c.id
      WHERE ${whereClause}
      ORDER BY p.id DESC
      `,
      params,
    );

    return rows;
  }

  // ค้นหาสินค้า (name, brand, description)
  static async searchProducts(filters = {}) {
    const { q = "", category, brand } = filters;
    const keyword = `%${q.trim()}%`;

    const whereConditions = [
      "p.status = 'active'",
      "(p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)",
    ];
    const params = [keyword, keyword, keyword];

    if (category) {
      whereConditions.push("c.name = ?");
      params.push(category);
    }

    if (brand) {
      whereConditions.push("p.brand = ?");
      params.push(brand);
    }

    const whereClause = whereConditions.join(" AND ");

    const [rows] = await pool.query(
      `
      SELECT
        p.id,
        p.sku,
        p.name,
        p.brand,
        p.description,
        p.price,
        p.stock,
        p.warranty,
        p.warranty_provider,
        p.image,
        p.featured,
        p.status,
        c.name AS category
      FROM products p
      JOIN categories c
      ON p.category_id = c.id
      WHERE ${whereClause}
      ORDER BY p.id DESC
      `,
      params,
    );

    return rows;
  }

  // ดึงสินค้าตาม id
  static async getProductById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        p.*,
        c.name AS category,
        c.name AS category_name
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
