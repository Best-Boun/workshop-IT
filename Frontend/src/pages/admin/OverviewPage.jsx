import { useEffect, useState } from "react";
import api from "../../api/axios";

const OverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const cards = stats
    ? [
        { label: "Total Revenue", value: `฿${Number(stats.orders.total_revenue || 0).toLocaleString()}`, subtitle: `${stats.orders.total_orders} orders total` },
        { label: "Total Orders", value: Number(stats.orders.total_orders).toLocaleString(), subtitle: `${stats.orders.pending_count} pending` },
        { label: "Registered Users", value: Number(stats.users.total_users).toLocaleString(), subtitle: "customers" },
        { label: "Total Products", value: Number(stats.products.total_products).toLocaleString(), subtitle: `${stats.products.low_stock} low stock` },
        { label: "Inventory Value", value: `฿${Number(stats.products.inventory_value || 0).toLocaleString()}`, subtitle: `${stats.products.out_of_stock} out of stock` },
        { label: "Total Paid", value: `฿${Number(stats.payments.total_paid || 0).toLocaleString()}`, subtitle: `${stats.payments.failed_count} failed payments` },
      ]
    : [];

  return (
    <div>
      <div className="mb-4">
        <h3>สรุปภาพรวม</h3>
        <p className="text-muted">ภาพรวมยอดขายและการเติบโตของธุรกิจ (ข้อมูลจริงจาก DB)</p>
      </div>

      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div key={card.label} className="col-12 col-sm-6 col-lg-4">
            <div className="admin-summary-card p-4 rounded shadow-sm h-100">
              <h6 className="mb-0 text-uppercase text-secondary mb-3">{card.label}</h6>
              <div className="display-6 fw-bold">{card.value}</div>
              <div className="text-muted mt-2">{card.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {stats && (
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <div className="admin-summary-panel p-4 rounded shadow-sm">
              <h5 className="mb-3">สถานะคำสั่งซื้อ</h5>
              {[
                { label: "Pending", val: stats.orders.pending_count, color: "#854d0e" },
                { label: "Processing", val: stats.orders.processing_count, color: "#1e40af" },
                { label: "Shipped", val: stats.orders.shipped_count, color: "#164e63" },
                { label: "Delivered", val: stats.orders.delivered_count, color: "#166534" },
                { label: "Cancelled", val: stats.orders.cancelled_count, color: "#991b1b" },
              ].map((s) => {
                const pct = stats.orders.total_orders > 0
                  ? Math.round((s.val / stats.orders.total_orders) * 100)
                  : 0;
                return (
                  <div key={s.label} className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span style={{ color: s.color, fontWeight: 600 }}>{s.label}</span>
                      <span>{s.val} ({pct}%)</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div className="progress-bar" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="admin-summary-panel p-4 rounded shadow-sm">
              <h5 className="mb-3">สต็อกสินค้า</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">📦 สินค้าทั้งหมด: <strong>{stats.products.total_products}</strong></li>
                <li className="mb-2">⚠️ สต็อกต่ำ (≤5): <strong className="text-warning">{stats.products.low_stock}</strong></li>
                <li className="mb-2">❌ หมดสต็อก: <strong className="text-danger">{stats.products.out_of_stock}</strong></li>
                <li className="mb-2">💰 มูลค่าคงคลัง: <strong>฿{Number(stats.products.inventory_value || 0).toLocaleString()}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;
