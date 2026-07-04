import { pool } from "../config/db.js";

class ReportModel {
  // Dashboard Summary
  static async getDashboardSummary() {
    const [summaryRows] = await pool.query(`
      SELECT
        COALESCE(SUM(total_price), 0) AS total_revenue,
        COUNT(*) AS total_orders,
        (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_customers,
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COALESCE(AVG(total_price), 0) FROM orders WHERE status = 'Delivered') AS average_order_value,
        (SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE DATE(created_at) = CURDATE()) AS today_revenue,
        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) AS today_orders,
        (SELECT COUNT(*) FROM users WHERE role = 'user' AND DATE(created_at) = CURDATE()) AS today_customers,
        (SELECT COALESCE(AVG(total_price), 0) FROM orders WHERE status = 'Delivered' AND DATE(created_at) = CURDATE()) AS today_average_order_value,
        (SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) AS yesterday_revenue,
        (SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE DATE(created_at) >= DATE_FORMAT(CURDATE(), '%Y-%m-01') AND DATE(created_at) <= CURDATE()) AS current_month_revenue,
        (SELECT COALESCE(SUM(total_price), 0) FROM orders WHERE DATE(created_at) >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH) AND DATE(created_at) < DATE_FORMAT(CURDATE(), '%Y-%m-01')) AS previous_month_revenue,
        (SELECT COUNT(*) FROM orders WHERE status = 'Pending') AS pending_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'Delivered') AS completed_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'Cancelled') AS cancelled_orders
      FROM orders
    `);

    const summary = summaryRows[0];

    const todayGrowthPercentage =
      summary.yesterday_revenue > 0
        ? ((summary.today_revenue - summary.yesterday_revenue) /
            summary.yesterday_revenue) *
          100
        : null;

    summary.today_growth_percentage = Number(todayGrowthPercentage.toFixed(1));
    summary.today_growth_trend =
      summary.today_growth_percentage > 0
        ? "Increase"
        : summary.today_growth_percentage < 0
          ? "Decrease"
          : "No Change";

    summary.monthly_goal = 1000000;
    summary.monthly_goal_progress =
      summary.current_month_revenue >= summary.monthly_goal
        ? 100
        : Number(
            (
              (summary.current_month_revenue / summary.monthly_goal) *
              100
            ).toFixed(1),
          );
    summary.monthly_goal_remaining = Math.max(
      summary.monthly_goal - summary.current_month_revenue,
      0,
    );

    const [topCustomerRows] = await pool.query(`
      SELECT
        CONCAT(first_name, ' ', last_name) AS customer_name,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.total_price), 0) AS total_spending
      FROM users u
      LEFT JOIN orders o
      ON u.id = o.user_id
      WHERE u.role = 'user'
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY total_spending DESC, total_orders DESC
      LIMIT 1
    `);

    summary.top_customer = topCustomerRows[0] || {
      customer_name: "No customer data",
      total_orders: 0,
      total_spending: 0,
    };

    const [lowStockRows] = await pool.query(`
      SELECT COUNT(*) AS low_stock_count
      FROM products
      WHERE stock <= 10
        AND status = 'active'
    `);

    summary.low_stock_count = lowStockRows[0].low_stock_count;

    const [latestOrderRows] = await pool.query(`
      SELECT id, created_at, status
      FROM orders
      ORDER BY id DESC
      LIMIT 1
    `);

    const latestOrder = latestOrderRows[0] || null;
    summary.notifications = [
      latestOrder
        ? {
            id: 1,
            type: "order",
            title: "New Order",
            message: `Order #${latestOrder.id} was placed recently.`,
            created_at: latestOrder.created_at,
          }
        : null,
      summary.today_customers > 0
        ? {
            id: 2,
            type: "customer",
            title: "New Customer Registered",
            message: `${summary.today_customers} new customer${summary.today_customers > 1 ? "s" : ""} joined today.`,
            created_at: new Date().toISOString(),
          }
        : null,
      summary.low_stock_count > 0
        ? {
            id: 3,
            type: "warning",
            title: "Low Stock Alert",
            message: `${summary.low_stock_count} product${summary.low_stock_count > 1 ? "s are" : " is"} running low.`,
            created_at: new Date().toISOString(),
          }
        : null,
    ]
      .filter(Boolean)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return summary;
  }

  static async getRevenueChart({ range = "1m", month, year } = {}) {
    const selectedYear = Number(year) || new Date().getFullYear();
    const selectedMonth = Number(month) || new Date().getMonth() + 1;
    const anchor = new Date(
      selectedYear,
      selectedMonth - 1,
      new Date().getDate(),
    );

    const formatDate = (date) => date.toISOString().split("T")[0] + " 00:00:00";

    let currentStart;
    let currentEnd;
    let previousStart;
    let previousEnd;
    let bucketExpression;
    let labelExpression;

    switch (range) {
      case "today":
        currentStart = new Date(
          anchor.getFullYear(),
          anchor.getMonth(),
          anchor.getDate(),
        );
        currentEnd = new Date(
          anchor.getFullYear(),
          anchor.getMonth(),
          anchor.getDate() + 1,
        );
        previousStart = new Date(
          anchor.getFullYear(),
          anchor.getMonth(),
          anchor.getDate() - 1,
        );
        previousEnd = currentStart;
        bucketExpression = "DATE_FORMAT(created_at, '%H:00')";
        labelExpression = "DATE_FORMAT(created_at, '%H:00')";
        break;
      case "5d":
        currentStart = new Date(
          anchor.getFullYear(),
          anchor.getMonth(),
          anchor.getDate() - 4,
        );
        currentEnd = new Date(
          anchor.getFullYear(),
          anchor.getMonth(),
          anchor.getDate() + 1,
        );
        previousStart = new Date(
          anchor.getFullYear(),
          anchor.getMonth(),
          anchor.getDate() - 9,
        );
        previousEnd = new Date(
          anchor.getFullYear(),
          anchor.getMonth(),
          anchor.getDate() - 4,
        );
        bucketExpression = "DATE_FORMAT(created_at, '%Y-%m-%d')";
        labelExpression = "DATE_FORMAT(created_at, '%b %d')";
        break;
      case "1m":
        currentStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
        currentEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
        previousStart = new Date(
          anchor.getFullYear(),
          anchor.getMonth() - 1,
          1,
        );
        previousEnd = currentStart;
        bucketExpression = "DATE_FORMAT(created_at, '%Y-%m-%d')";
        labelExpression = "DATE_FORMAT(created_at, '%b %d')";
        break;
      case "3m":
        currentStart = new Date(anchor.getFullYear(), anchor.getMonth() - 2, 1);
        currentEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
        previousStart = new Date(
          anchor.getFullYear(),
          anchor.getMonth() - 5,
          1,
        );
        previousEnd = new Date(anchor.getFullYear(), anchor.getMonth() - 2, 1);
        bucketExpression = "DATE_FORMAT(created_at, '%x-%v')";
        labelExpression = "CONCAT('Week ', WEEK(created_at, 1))";
        break;
      case "6m":
        currentStart = new Date(anchor.getFullYear(), anchor.getMonth() - 5, 1);
        currentEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
        previousStart = new Date(
          anchor.getFullYear(),
          anchor.getMonth() - 11,
          1,
        );
        previousEnd = new Date(anchor.getFullYear(), anchor.getMonth() - 5, 1);
        bucketExpression = "DATE_FORMAT(created_at, '%Y-%m')";
        labelExpression = "DATE_FORMAT(created_at, '%b %Y')";
        break;
      case "1y":
        currentStart = new Date(anchor.getFullYear() - 1, anchor.getMonth(), 1);
        currentEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
        previousStart = new Date(
          anchor.getFullYear() - 2,
          anchor.getMonth(),
          1,
        );
        previousEnd = currentStart;
        bucketExpression = "DATE_FORMAT(created_at, '%Y-%m')";
        labelExpression = "DATE_FORMAT(created_at, '%b %Y')";
        break;
      case "5y":
        currentStart = new Date(anchor.getFullYear() - 5, anchor.getMonth(), 1);
        currentEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
        previousStart = new Date(
          anchor.getFullYear() - 10,
          anchor.getMonth(),
          1,
        );
        previousEnd = new Date(anchor.getFullYear() - 5, anchor.getMonth(), 1);
        bucketExpression = "DATE_FORMAT(created_at, '%Y')";
        labelExpression = "DATE_FORMAT(created_at, '%Y')";
        break;
      case "all":
        currentStart = null;
        currentEnd = null;
        previousStart = null;
        previousEnd = null;
        bucketExpression = "DATE_FORMAT(created_at, '%Y')";
        labelExpression = "DATE_FORMAT(created_at, '%Y')";
        break;
      default:
        currentStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
        currentEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
        previousStart = new Date(
          anchor.getFullYear(),
          anchor.getMonth() - 1,
          1,
        );
        previousEnd = currentStart;
        bucketExpression = "DATE_FORMAT(created_at, '%Y-%m-%d')";
        labelExpression = "DATE_FORMAT(created_at, '%b %d')";
    }

    const currentWhere = currentStart
      ? "created_at >= ? AND created_at < ?"
      : "1 = 1";
    const currentParams = currentStart
      ? [formatDate(currentStart), formatDate(currentEnd)]
      : [];
    const previousWhere = previousStart
      ? "created_at >= ? AND created_at < ?"
      : "1 = 1";
    const previousParams = previousStart
      ? [formatDate(previousStart), formatDate(previousEnd)]
      : [];

    const [currentRows] = await pool.query(
      `
     SELECT
  ${bucketExpression} AS bucket,
  ${labelExpression} AS label,
  SUM(total_price) AS revenue,
  COUNT(*) AS order_count,
  COUNT(DISTINCT user_id) AS customer_count,
  AVG(total_price) AS average_order_value
FROM orders
WHERE ${currentWhere}
GROUP BY bucket, label
ORDER BY bucket ASC
      `,
      currentParams,
    );

    const [previousRows] = await pool.query(
      `
        SELECT
          SUM(total_price) AS revenue,
          COUNT(*) AS order_count,
          COUNT(DISTINCT user_id) AS customer_count,
          AVG(total_price) AS average_order_value
        FROM orders
        WHERE ${previousWhere}
      `,
      previousParams,
    );

    const currentRevenue = currentRows.reduce(
      (sum, row) => sum + Number(row.revenue || 0),
      0,
    );
    const previousRevenue = previousRows.reduce(
      (sum, row) => sum + Number(row.revenue || 0),
      0,
    );
    const growthPercentage =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : currentRevenue > 0
          ? 100
          : 0;

    return {
      range,
      labels: currentRows.map((row) => row.label),
      data: currentRows.map((row) => Number(row.revenue || 0)),
      current_revenue: Number(currentRevenue.toFixed(2)),
      previous_revenue: Number(previousRevenue.toFixed(2)),
      growth_percentage: Number(growthPercentage.toFixed(1)),
      growth_trend:
        growthPercentage > 0
          ? "Increase"
          : growthPercentage < 0
            ? "Decrease"
            : "No Change",
      current_orders: Number(
        currentRows.reduce((sum, row) => sum + Number(row.order_count || 0), 0),
      ),
      current_customers: Number(
        currentRows.reduce(
          (sum, row) => sum + Number(row.customer_count || 0),
          0,
        ),
      ),
      average_order_value: Number(
        currentRows.reduce(
          (sum, row) => sum + Number(row.average_order_value || 0),
          0,
        ) / Math.max(currentRows.length, 1),
      ).toFixed(2),
      previous_orders: Number(previousRows[0]?.order_count || 0),
      previous_customers: Number(previousRows[0]?.customer_count || 0),
      previous_average_order_value: Number(
        previousRows[0]?.average_order_value || 0,
      ).toFixed(2),
    };
  }

  // Monthly Sales
  static async getMonthlySales() {
    const [rows] = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        SUM(total_price) AS revenue,
        COUNT(*) AS order_count
      FROM orders
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    return rows;
  }

  // Top Selling Products
  static async getTopProducts() {
    const [rows] = await pool.query(`
      SELECT
        p.name AS product_name,
        SUM(oi.quantity) AS quantity_sold,
        SUM(oi.subtotal) AS revenue
      FROM order_items oi
      JOIN products p
      ON oi.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY quantity_sold DESC, revenue DESC
      LIMIT 10
    `);

    return rows;
  }

  // Customer Report
  static async getCustomerReport() {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total_customers,
        SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) AS verified_customers,
        SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) AS new_customers_this_month
      FROM users
      WHERE role = 'user'
    `);

    const [topCustomers] = await pool.query(`
      SELECT
        CONCAT(first_name, ' ', last_name) AS customer_name,
        COUNT(o.id) AS total_orders,
        COALESCE(SUM(o.total_price), 0) AS total_spending
      FROM users u
      LEFT JOIN orders o
      ON u.id = o.user_id
      WHERE u.role = 'user'
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY total_spending DESC, total_orders DESC
      LIMIT 5
    `);

    return {
      ...rows[0],
      top_customers: topCustomers,
    };
  }

  // Recent Orders
  static async getRecentOrders() {
    const [rows] = await pool.query(`
      SELECT
        o.id AS order_id,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        o.status,
        o.total_price AS total,
        o.created_at AS created_date
      FROM orders o
      LEFT JOIN users u
      ON o.user_id = u.id
      ORDER BY o.id DESC
      LIMIT 10
    `);

    return rows;
  }

  // Order Status Report
  static async getOrderStatusReport() {
    const [rows] = await pool.query(`
      SELECT
        status,
        COUNT(*) AS count
      FROM orders
      GROUP BY status
    `);

    const statusMap = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    rows.forEach((row) => {
      if (statusMap[row.status] !== undefined) {
        statusMap[row.status] = row.count;
      }
    });

    return statusMap;
  }
}

export default ReportModel;
