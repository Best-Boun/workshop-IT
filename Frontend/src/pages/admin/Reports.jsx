import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getMonthlySales,
  getTopProducts,
  getOrderStatusReport,
  getPaymentAnalytics,
} from "../../services/reportService";
import { canAccessPage } from "../../components/PrivateRoute";

// Temporary hardcoded data until real APIs are available.
// Replace these with live data once backend endpoints are ready.



// Small reusable presentational pieces -------------------------------------

const KpiCard = ({ icon, iconColor, label, value, hint }) => (
  <div className="col-xl-3 col-md-6">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body d-flex align-items-start gap-3">
        <div
          className={`d-flex align-items-center justify-content-center rounded-3 bg-${iconColor}-subtle text-${iconColor} flex-shrink-0`}
          style={{ width: "48px", height: "48px" }}
        >
          <i className={`bi ${icon} fs-4`} />
        </div>
        <div>
          <h6 className="text-muted text-uppercase small mb-1">{label}</h6>
          <h3 className="fw-bold mb-0">{value}</h3>
          {hint && <small className="text-muted">{hint}</small>}
        </div>
      </div>
    </div>
  </div>
);

const ProgressRow = ({ icon, label, value, pct, color }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-1">
      <span className="d-flex align-items-center gap-2">
        {icon && <i className={`bi ${icon} text-${color}`} />}
        <span className="fw-semibold small">{label}</span>
      </span>
      <span className="text-muted small">{value}</span>
    </div>
    <div className="progress" style={{ height: "8px" }}>
      <div
        className={`progress-bar bg-${color}`}
        role="progressbar"
        style={{ width: `${pct}%` }}
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  </div>
);

const Reports = () => {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
  );
  const canManageReports = canAccessPage(user, "reports", "manage");

  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentAnalytics, setPaymentAnalytics] = useState([]);
  
  const [statusSummary, setStatusSummary] = useState({});

  // recentOrders is still fetched (API must not be removed/broken) but no
  // longer rendered on this page - Recent Orders now lives on the Dashboard.
  

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [summaryData, salesData, productsData, statusData, paymentData] =
          await Promise.all([
            getDashboardSummary(),
            getMonthlySales(),
            getTopProducts(),
            getOrderStatusReport(),
            getPaymentAnalytics(),
          ]);;

        setSummary(summaryData);
        setSales(salesData || []);
        setProducts(productsData || []);
        setPaymentAnalytics(paymentData || []);
        
        setStatusSummary(statusData || {});
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    void loadReports();
  }, []);

  if (!summary) {
    return <div className="container-fluid">Loading...</div>;
  }

  const salesGrowth =
    Number(summary.previous_month_revenue) > 0
      ? (
          ((Number(summary.current_month_revenue) -
            Number(summary.previous_month_revenue)) /
            Number(summary.previous_month_revenue)) *
          100
        ).toFixed(1)
      : 0;

      const paymentName = {
        credit_card: "Credit Card",
        promptpay: "PromptPay",
        bank_transfer: "Bank Transfer",
        cod: "Cash on Delivery",
      };

  const statusCards = [
    {
      label: "Pending",
      value: statusSummary.Pending || 0,
      color: "secondary",
      icon: "bi-hourglass-split",
    },
    {
      label: "Processing",
      value: statusSummary.Processing || 0,
      color: "warning",
      icon: "bi-gear",
    },
    {
      label: "Shipped",
      value: statusSummary.Shipped || 0,
      color: "info",
      icon: "bi-truck",
    },
    {
      label: "Delivered",
      value: statusSummary.Delivered || 0,
      color: "success",
      icon: "bi-check-circle",
    },
    {
      label: "Cancelled",
      value: statusSummary.Cancelled || 0,
      color: "danger",
      icon: "bi-x-circle",
    },
  ];

  const totalStatusCount = statusCards.reduce(
    (acc, item) => acc + Number(item.value || 0),
    0,
  );

  const maxRevenue = sales.length
    ? Math.max(...sales.map((item) => Number(item.revenue || 0)))
    : 0;

  // Client-side CSV export built from data already loaded on this page.
  // Swap this out for a backend export endpoint whenever one exists.
  const handleExportCSV = () => {
    if (!canManageReports) return;

    const rows = [
      ["Month", "Revenue", "Orders"],
      ...sales.map((item) => [
        item.month,
        Number(item.revenue || 0),
        item.order_count || 0,
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // PDF export backend isn't ready yet - UI only for now.
  const handleExportPDF = () => {
    if (!canManageReports) return;

    alert("PDF export is coming soon.");
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Sales Report</h4>
          <p className="text-muted mb-0">Business Performance Report</p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
            disabled={!canManageReports}
            onClick={handleExportCSV}
          >
            <i className="bi bi-file-earmark-spreadsheet" />
            Export CSV
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            disabled={!canManageReports}
            onClick={handleExportPDF}
          >
            <i className="bi bi-file-earmark-pdf" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Section 1: KPI Cards */}
      <div className="row g-4 mb-4">
        <KpiCard
          icon="bi-cash-stack"
          iconColor="primary"
          label="Total Revenue"
          value={`฿${Number(summary.total_revenue || 0).toLocaleString()}`}
        />
        <KpiCard
          icon="bi-bag-check"
          iconColor="info"
          label="Total Orders"
          value={summary.total_orders || 0}
        />
        <KpiCard
          icon="bi-receipt"
          iconColor="warning"
          label="Average Order Value"
          value={`฿${Number(summary.average_order_value || 0).toLocaleString()}`}
        />
        <KpiCard
          icon="bi-graph-up-arrow"
          iconColor="success"
          label="Sales Growth"
          value={`${salesGrowth > 0 ? "+" : ""}${salesGrowth}%`}
          hint={
            Number(summary.previous_month_revenue) > 0
              ? "Compared with last month"
              : "No previous month data"
          }
        />
      </div>

      <div className="row g-4 mb-4">
        {/* Section 2: Revenue Trend */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Revenue Trend</h5>

              {sales.length === 0 && (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-bar-chart-line fs-1 d-block mb-2 opacity-50" />
                  No sales data found yet.
                </div>
              )}

              {sales.length === 1 && (
                <div className="d-flex align-items-center justify-content-between border rounded-3 p-4">
                  <div>
                    <p className="text-muted small mb-1">{sales[0].month}</p>
                    <h3 className="fw-bold mb-0">
                      ฿{Number(sales[0].revenue || 0).toLocaleString()}
                    </h3>
                    <small className="text-muted">
                      {sales[0].order_count || 0} orders
                    </small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-primary-subtle text-primary px-3 py-2">
                      <i className="bi bi-info-circle me-1" />
                      More months needed for a trend
                    </span>
                  </div>
                </div>
              )}

              {sales.length > 1 && (
                <div
                  className="d-flex align-items-end gap-3 px-2"
                  style={{ height: "220px" }}
                >
                  {sales.map((item) => {
                    const revenue = Number(item.revenue || 0);
                    const heightPct =
                      maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                    return (
                      <div
                        key={item.month}
                        className="d-flex flex-column align-items-center justify-content-end flex-fill h-100"
                        style={{ maxWidth: "90px" }}
                      >
                        <small className="text-muted mb-1">
                          ฿{revenue.toLocaleString()}
                        </small>
                        <div
                          className="bg-primary rounded-top w-100"
                          style={{
                            height: `${Math.max(heightPct, 2)}%`,
                            minHeight: "4px",
                          }}
                          title={`${item.month}: ฿${revenue.toLocaleString()}`}
                        />
                        <small className="text-muted mt-2">{item.month}</small>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Order Analytics */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Order Analytics</h5>
              <div className="d-grid gap-4">
                {statusCards.map((item) => {
                  const pct =
                    totalStatusCount > 0
                      ? Math.round(
                          (Number(item.value || 0) / totalStatusCount) * 100,
                        )
                      : 0;
                  return (
                    <ProgressRow
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      value={`${item.value} (${pct}%)`}
                      pct={pct}
                      color={item.color}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Section 4: Top Selling Products */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Top Selling Products</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="text-end">Quantity Sold</th>
                      <th className="text-end">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.product_name}>
                          <td className="fw-semibold">
                            {product.product_name}
                          </td>
                          <td className="text-end">
                            {product.quantity_sold || 0}
                          </td>
                          <td className="text-end">
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

        {/* Payment Analytics (replaces Customer Statistics) */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-1">Payment Analytics</h5>
              <p className="text-muted small mb-3">
                Real payment statistics based on completed payments.
              </p>
              <div className="d-grid gap-4">
                {paymentAnalytics.map((item) => (
                  <ProgressRow
                    key={item.method}
                    icon={
                      {
                        credit_card: "bi-credit-card",
                        promptpay: "bi-phone",
                        bank_transfer: "bi-bank",
                        cod: "bi-cash-coin",
                      }[item.method] || "bi-wallet2"
                    }
                    label={paymentName[item.method] || item.method}
                    value={`${item.count} (${item.percentage}%)`}
                    pct={item.percentage}
                    color="primary"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Summary (replaces Recent Orders) */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Monthly Revenue Summary</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Month</th>
                  <th className="text-end">Revenue</th>
                  <th className="text-end">Orders</th>
                  <th className="text-end">Growth</th>
                </tr>
              </thead>
              <tbody>
                {sales.length > 0 ? (
                  sales.map((item, index) => {
                    const prevRevenue =
                      index > 0 ? Number(sales[index - 1].revenue || 0) : null;
                    const revenue = Number(item.revenue || 0);
                    // Growth calculated from real data when a previous month
                    // exists; otherwise falls back to a hardcoded placeholder.
                    let growthValue = 0;
                    let hasRealGrowth = false;
                    if (prevRevenue !== null && prevRevenue > 0) {
                      growthValue =
                        ((revenue - prevRevenue) / prevRevenue) * 100;
                      hasRealGrowth = true;
                    }
                    const isPositive = growthValue >= 0;
                    const growthLabel = `${isPositive ? "+" : ""}${growthValue.toFixed(1)}%`;

                    return (
                      <tr key={item.month}>
                        <td className="fw-semibold">{item.month}</td>
                        <td className="text-end">
                          ฿{revenue.toLocaleString()}
                        </td>
                        <td className="text-end">{item.order_count || 0}</td>
                        <td className="text-end">
                          <span
                            className={`badge ${
                              isPositive
                                ? "bg-success-subtle text-success"
                                : "bg-danger-subtle text-danger"
                            }`}
                          >
                            <i
                              className={`bi ${isPositive ? "bi-arrow-up-short" : "bi-arrow-down-short"} me-1`}
                            />
                            {growthLabel}
                            {!hasRealGrowth && (
                              <span className="ms-1 text-muted">
                                First Month
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No revenue data found.
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
