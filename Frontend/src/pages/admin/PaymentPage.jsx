import { useEffect, useState } from "react";
import api from "../../api/axios";

const PaymentPage = () => {
  const [stats, setStats] = useState(null);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/payment-methods"),
    ])
      .then(([statsRes, methodsRes]) => {
        setStats(statsRes.data.data.payments);
        setMethods(methodsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = methods.reduce((s, m) => s + Number(m.total_revenue || 0), 0);

  return (
    <div>
      <div className="mb-4">
        <h3>Payments</h3>
        <p className="text-muted">ภาพรวมการชำระเงินและช่องทางการชำระ</p>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "Total Revenue", value: stats ? `฿${Number(stats.total_revenue || 0).toLocaleString()}` : "…" },
          { label: "Completed", value: stats?.completed ?? "…" },
          { label: "Pending", value: stats?.pending ?? "…" },
          { label: "Refunded/Failed", value: stats ? (Number(stats.refunded||0) + Number(stats.failed||0)) : "…" },
        ].map((item) => (
          <div key={item.label} className="col-12 col-sm-6 col-lg-3">
            <div className="admin-summary-card p-4 rounded shadow-sm h-100">
              <div className="text-uppercase text-secondary mb-2">{item.label}</div>
              <div className="display-6 fw-bold">{loading ? "…" : item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel p-4 rounded shadow-sm">
        <h5 className="mb-3">สัดส่วนช่องทางชำระเงิน</h5>
        <ul className="list-unstyled mb-0">
          <li>• บัตรเครดิต: 45%</li>
          <li>• Mobile Banking: 30%</li>
          <li>• COD: 10%</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentPage;
