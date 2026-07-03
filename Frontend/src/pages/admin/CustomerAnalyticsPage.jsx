import { useEffect, useState } from "react";
import api from "../../api/axios";

const CustomerAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = Number(stats?.users?.total_users || 0);
  const totalOrders = Number(stats?.orders?.total_orders || 0);
  const avgOrderValue = totalOrders > 0
    ? Number(stats?.payments?.total_revenue || 0) / totalOrders
    : 0;

  return (
    <div>
      <div className="mb-4">
        <h3>Customer Analytics</h3>
        <p className="text-muted">ข้อมูลวิเคราะห์ลูกค้าและพฤติกรรมการซื้อ</p>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "Total Users", value: loading ? "…" : totalUsers.toLocaleString() },
          { label: "Total Orders", value: loading ? "…" : totalOrders.toLocaleString() },
          { label: "Avg. Order Value", value: loading ? "…" : `฿${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: "Orders / User", value: loading ? "…" : totalUsers > 0 ? (totalOrders / totalUsers).toFixed(2) : "—" },
        ].map((item) => (
          <div key={item.label} className="col-12 col-sm-6 col-lg-3">
            <div className="admin-summary-card p-4 rounded shadow-sm h-100">
              <div className="text-uppercase text-secondary mb-2">{item.label}</div>
              <div className="display-6 fw-bold">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="admin-panel p-4 rounded shadow-sm h-100">
            <h5 className="mb-3">Order Status Breakdown</h5>
            {loading ? (
              <div className="d-flex justify-content-center py-4"><div className="spinner-border text-primary" /></div>
            ) : (
              <div className="vstack gap-3">
                {[
                  { label: "Pending", key: "pending", color: "warning" },
                  { label: "Processing", key: "processing", color: "info" },
                  { label: "Shipped", key: "shipped", color: "primary" },
                  { label: "Delivered", key: "delivered", color: "success" },
                  { label: "Cancelled", key: "cancelled", color: "danger" },
                ].map(({ label, key, color }) => {
                  const count = Number(stats?.orders?.[key] || 0);
                  const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-semibold">{label}</span>
                        <span className="small text-muted">{count} ({pct}%)</span>
                      </div>
                      <div className="progress" style={{ height: 8 }}>
                        <div className={`progress-bar bg-${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="admin-panel p-4 rounded shadow-sm h-100">
            <h5 className="mb-3">Revenue Summary</h5>
            {loading ? (
              <div className="d-flex justify-content-center py-4"><div className="spinner-border text-primary" /></div>
            ) : (
              <div className="vstack gap-3">
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted">Total Revenue</span>
                  <span className="fw-bold text-success">฿{Number(stats?.payments?.total_revenue || 0).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted">Completed Payments</span>
                  <span className="fw-bold">{stats?.payments?.completed ?? 0}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted">Pending Payments</span>
                  <span className="fw-bold text-warning">{stats?.payments?.pending ?? 0}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total Products</span>
                  <span className="fw-bold">{stats?.products?.total_products ?? 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsPage;
