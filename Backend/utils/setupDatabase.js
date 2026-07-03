import { pool } from "../config/db.js";

export const setupDatabase = async () => {
  try {
    console.log("Setting up database tables...");

    // Create orders table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        shipping_address VARCHAR(255),
        shipping_city VARCHAR(100),
        shipping_postal_code VARCHAR(20),
        shipping_country VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `);

    console.log("✅ Orders table created");

    // Create order_items table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
        INDEX idx_order_id (order_id),
        INDEX idx_product_id (product_id)
      )
    `);

    console.log("✅ Order_items table created");

    // Create payments table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        user_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        transaction_id VARCHAR(255) UNIQUE,
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_order_id (order_id),
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_transaction_id (transaction_id),
        INDEX idx_created_at (created_at)
      )
    `);

    console.log("✅ Payments table created");
    console.log("✅ Database setup complete!");

    return true;
  } catch (error) {
    if (error.code === "ER_TABLE_EXISTS_ERROR") {
      console.log("✅ Tables already exist");
      return true;
    }
    console.error("❌ Database setup error:", error);
    throw error;
  }
};
