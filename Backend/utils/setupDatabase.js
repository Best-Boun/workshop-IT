import { pool } from "../config/db.js";

export const setupDatabase = async () => {
  try {
    console.log("Setting up database tables...");

    // Create users table first because other tables depend on it
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        google_id VARCHAR(255),
        profile_image VARCHAR(255),
        role ENUM('user', 'admin', 'superadmin') DEFAULT 'user',
        permissions TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);

    console.log("✅ Users table created");

    const [permissionColumn] = await pool.execute(
      "SHOW COLUMNS FROM users LIKE 'permissions'",
    );

    if (permissionColumn.length === 0) {
      await pool.execute(
        "ALTER TABLE users ADD COLUMN permissions TEXT DEFAULT NULL",
      );
      console.log("✅ Users permissions column added");
    }

    // ──────────────────────────────────────────────────────────
    // orders table  (real schema uses total_price, not total_amount)
    // ──────────────────────────────────────────────────────────
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        shipping_name VARCHAR(255),
        shipping_phone VARCHAR(20),
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

    // Add shipping columns if they don't exist yet (table pre-existed with old schema)
    const shippingCols = [
      ["shipping_name",        "VARCHAR(255)"],
      ["shipping_phone",       "VARCHAR(20)"],
      ["shipping_address",     "VARCHAR(255)"],
      ["shipping_city",        "VARCHAR(100)"],
      ["shipping_postal_code", "VARCHAR(20)"],
      ["shipping_country",     "VARCHAR(100)"],
    ];
    for (const [col, def] of shippingCols) {
      const [exists] = await pool.execute(`SHOW COLUMNS FROM orders LIKE '${col}'`);
      if (exists.length === 0) {
        await pool.execute(`ALTER TABLE orders ADD COLUMN ${col} ${def}`);
        console.log(`✅ orders.${col} column added`);
      }
    }

    // ──────────────────────────────────────────────────────────
    // order_items table
    // ──────────────────────────────────────────────────────────
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10,2) GENERATED ALWAYS AS (price * quantity) STORED,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
        INDEX idx_order_id (order_id),
        INDEX idx_product_id (product_id)
      )
    `);

    console.log("✅ Order_items table ready");

    // ──────────────────────────────────────────────────────────
    // payments table  (real schema uses payment_status, not status)
    // ──────────────────────────────────────────────────────────
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        payment_method VARCHAR(50),
        payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        transaction_id VARCHAR(255) UNIQUE,
        amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        paid_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_order_id (order_id),
        INDEX idx_payment_status (payment_status),
        INDEX idx_transaction_id (transaction_id),
        INDEX idx_created_at (created_at)
      )
    `);

    // Add amount column if it doesn't exist (old schema may lack it)
    const [amtExists] = await pool.execute("SHOW COLUMNS FROM payments LIKE 'amount'");
    if (amtExists.length === 0) {
      await pool.execute("ALTER TABLE payments ADD COLUMN amount DECIMAL(10,2) NOT NULL DEFAULT 0");
      console.log("✅ payments.amount column added");
    }

    // Add paid_at column if missing
    const [paidAtExists] = await pool.execute("SHOW COLUMNS FROM payments LIKE 'paid_at'");
    if (paidAtExists.length === 0) {
      await pool.execute("ALTER TABLE payments ADD COLUMN paid_at TIMESTAMP NULL");
      console.log("✅ payments.paid_at column added");
    }

    console.log("✅ Payments table ready");
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
