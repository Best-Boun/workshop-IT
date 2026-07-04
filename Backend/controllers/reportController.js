import ReportModel from "../models/reportModel.js";

class ReportController {
  // GET /api/reports/dashboard
  static async getDashboardSummary(req, res) {
    try {
      const summary = await ReportModel.getDashboardSummary();

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard report",
      });
    }
  }

  // GET /api/reports/chart
  static async getRevenueChart(req, res) {
    try {
      const { range = "1m", month, year } = req.query;
      const analytics = await ReportModel.getRevenueChart({
        range,
        month,
        year,
      });

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch revenue chart report",
      });
    }
  }

  // GET /api/reports/sales
  static async getMonthlySales(req, res) {
    try {
      const sales = await ReportModel.getMonthlySales();

      res.status(200).json({
        success: true,
        data: sales,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch sales report",
      });
    }
  }

  // GET /api/reports/products
  static async getTopProducts(req, res) {
    try {
      const products = await ReportModel.getTopProducts();

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch product report",
      });
    }
  }

  // GET /api/reports/customers
  static async getCustomerReport(req, res) {
    try {
      const customers = await ReportModel.getCustomerReport();

      res.status(200).json({
        success: true,
        data: customers,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch customer report",
      });
    }
  }

  // GET /api/reports/orders
  static async getRecentOrders(req, res) {
    try {
      const orders = await ReportModel.getRecentOrders();

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch recent orders",
      });
    }
  }

  // GET /api/reports/status
  static async getOrderStatusReport(req, res) {
    try {
      const status = await ReportModel.getOrderStatusReport();

      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch order status report",
      });
    }
  }
}

export default ReportController;
