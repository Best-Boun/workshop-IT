import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getMonthlySales,
  getTopProducts,
  getCustomerReport,
  getRecentOrders,
} from "../../services/reportService";

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [
          summaryData,
          salesData,
          productsData,
          customerData,
          recentOrdersData,
        ] = await Promise.all([
          getDashboardSummary(),
          getMonthlySales(),
          getTopProducts(),
          getCustomerReport(),
          getRecentOrders(),
        ]);

        setSummary(summaryData);
        setSales(salesData || []);
        setProducts(productsData || []);
        setCustomers(customerData);
        setRecentOrders(recentOrdersData || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    void loadReports();
  }, []);

  if (!summary || !customers) {
    return <div className="container-fluid">Loading...</div>;
  }

  const statusCards = [
    {
      label: "Pending",
      value: summary.pending_orders || 0,
      color: "secondary",
    },
    { label: "Processing", value: 0, color: "warning" },
    { label: "Shipped", value: 0, color: "info" },
    {
      label: "Completed",
      value: summary.completed_orders || 0,
      color: "success",
    },
    {
      label: "Cancelled",
      value: summary.cancelled_orders || 0,
      color: "danger",
    },
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {/* <h2 className="fw-bold mb-1">Reports</h2> */}
          <p className="text-muted mb-0">Business analytics overview</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Revenue</h6>
              <h3 className="fw-bold mb-0">
                ฿{Number(summary.total_revenue || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Orders</h6>
              <h3 className="fw-bold mb-0">{summary.total_orders || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Customers</h6>
              <h3 className="fw-bold mb-0">{summary.total_customers || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Products</h6>
              <h3 className="fw-bold mb-0">{summary.total_products || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Average Order Value</h6>
              <h3 className="fw-bold mb-0">
                ฿{Number(summary.average_order_value || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Today&apos;s Revenue</h6>
              <h3 className="fw-bold mb-0">฿0</h3>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">This Month Revenue</h6>
              <h3 className="fw-bold mb-0">
                ฿{Number(summary.total_revenue || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Completed Orders</h6>
              <h3 className="fw-bold mb-0">{summary.completed_orders || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Monthly Sales</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Month</th>
                      <th>Revenue</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length > 0 ? (
                      sales.map((item) => (
                        <tr key={item.month}>
                          <td>{item.month}</td>
                          <td>฿{Number(item.revenue || 0).toLocaleString()}</td>
                          <td>{item.order_count || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          No sales data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Order Status Summary</h5>
              <div className="d-grid gap-2">
                {statusCards.map((item) => (
                  <div
                    key={item.label}
                    className="d-flex justify-content-between align-items-center border rounded p-2"
                  >
                    <span className={`badge bg-${item.color}`}>
                      {item.label}
                    </span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Top Selling Products</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Quantity Sold</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.product_name}>
                          <td>{product.product_name}</td>
                          <td>{product.quantity_sold || 0}</td>
                          <td>
                            ฿{Number(product.revenue || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          No product data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Customer Statistics</h5>
              <p className="mb-2">
                <strong>Total Customers:</strong>{" "}
                {customers.total_customers || 0}
              </p>
              <p className="mb-2">
                <strong>Verified Customers:</strong>{" "}
                {customers.verified_customers || 0}
              </p>
              <p className="mb-2">
                <strong>New This Month:</strong>{" "}
                {customers.new_customers_this_month || 0}
              </p>
              <hr />
              <p className="mb-2">
                <strong>Top Customer:</strong>{" "}
                {customers.top_customers?.[0]?.customer_name || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Recent Orders</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td>#{order.order_id}</td>
                      <td>{order.customer_name || "-"}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {order.status}
                        </span>
                      </td>
                      <td>฿{Number(order.total || 0).toLocaleString()}</td>
                      <td>
                        {order.created_date
                          ? new Date(order.created_date).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
