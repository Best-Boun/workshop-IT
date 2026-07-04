// import DashboardHeader from "../../components/admin/Dashboard/DashboardHeader";
import StatsCards from "../../components/admin/Dashboard/StatsCards";
import RevenueChart from "../../components/admin/Dashboard/RevenueChart";
import LatestOrders from "../../components/admin/Dashboard/LatestOrders";
import TopProducts from "../../components/admin/Dashboard/TopProducts";
import LowStock from "../../components/admin/Dashboard/LowStock";
import QuickActions from "../../components/admin/Dashboard/QuickActions";
import ReportsPage from "./ReportsPage";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/reportService";
import "../../components/admin/Dashboard/Dashboard.css";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const data = await getDashboardSummary();
      setSummary(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading dashboard summary:", error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
   // โหลดครั้งแรก
   void loadDashboard();

   // โหลดใหม่ทุก 5 วินาที
   const interval = setInterval(() => {
     void loadDashboard();
   }, 5000);

   return () => clearInterval(interval);
 }, []);

  return (
    <div className="dashboard-page">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold mb-1">Executive Dashboard</h4>
          <p className="text-muted mb-0">
            Real-time commerce analytics from your MySQL data
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">
            Last updated {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => void loadDashboard()}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      <StatsCards summary={summary} loading={loading} />

      <div className="row mt-4 g-4">
        <div className="col-lg-8">
          <RevenueChart />
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Today&apos;s Summary</h5>
                <span className="badge bg-primary">Live</span>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <div className="dashboard-ghost p-2 rounded-3">
                    <small className="text-muted d-block">Revenue</small>
                    <strong>
                      ฿{Number(summary?.today_revenue || 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="dashboard-ghost p-2 rounded-3">
                    <small className="text-muted d-block">Orders</small>
                    <strong>{summary?.today_orders || 0}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="dashboard-ghost p-2 rounded-3">
                    <small className="text-muted d-block">Customers</small>
                    <strong>{summary?.today_customers || 0}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="dashboard-ghost p-2 rounded-3">
                    <small className="text-muted d-block">Avg Order</small>
                    <strong>
                      ฿
                      {Number(
                        summary?.today_average_order_value || 0,
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Growth vs yesterday</span>
                  <span
                    className={`fw-semibold ${Number(summary?.today_growth_percentage || 0) >= 0 ? "text-success" : "text-danger"}`}
                  >
                    {Number(summary?.today_growth_percentage || 0).toFixed(1)}%
                  </span>
                </div>
                <small className="text-muted">
                  {summary?.today_growth_trend || "No Change"}
                </small>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Notifications</h5>
              <div className="d-grid gap-2">
                {summary?.notifications?.length ? (
                  summary.notifications.map((item) => (
                    <div key={item.id} className="notification-item">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary-subtle text-primary">
                          {item.title}
                        </span>
                      </div>
                      <p className="mb-0 mt-2 small">{item.message}</p>
                      <small className="text-muted">
                        {new Date(item.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <div className="text-muted small">No new notifications.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4 g-4">
        <div className="col-lg-7">
          <LatestOrders />
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Monthly Goal</h5>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Target</span>
                <strong>
                  ฿{Number(summary?.monthly_goal || 1000000).toLocaleString()}
                </strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Current</span>
                <strong>
                  ฿
                  {Number(summary?.current_month_revenue || 0).toLocaleString()}
                </strong>
              </div>
              <div className="progress" style={{ height: "10px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${Math.min(summary?.monthly_goal_progress || 0, 100)}%`,
                  }}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2 small text-muted">
                <span>{summary?.monthly_goal_progress || 0}% completed</span>
                <span>
                  Remaining ฿
                  {Number(
                    summary?.monthly_goal_remaining || 0,
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Top Customer</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-semibold mb-1">
                    {summary?.top_customer?.customer_name || "No customer data"}
                  </h6>
                  <p className="text-muted small mb-0">
                    {summary?.top_customer?.total_orders || 0} orders
                  </p>
                </div>
                <strong>
                  ฿
                  {Number(
                    summary?.top_customer?.total_spending || 0,
                  ).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4 g-4">
        <div className="col-lg-8">
          <TopProducts />
        </div>

        <div className="col-lg-4">
          <LowStock />
        </div>
      </div>

      <QuickActions />

      <div className="mt-4">
        <ReportsPage />
      </div>
    </div>
  );
};

export default Dashboard;
