import { Link } from "react-router-dom";

const ReportsPage = () => {
  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>Reports & Notifications</h3>
          <p className="text-muted">สร้างรายงานและติดตามแจ้งเตือนสำคัญ</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "Low Stock Alerts", value: 12 },
          { label: "New Order Alerts", value: 3 },
          { label: "Payment Failures", value: 2 },
        ].map((item) => (
          <div key={item.label} className="col-12 col-sm-4">
            <div className="admin-summary-card p-4 rounded shadow-sm h-100">
              <div className="text-uppercase text-secondary mb-2">{item.label}</div>
              <div className="display-6 fw-bold">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel p-4 rounded shadow-sm">
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button className="btn btn-primary btn-sm">Download Excel</button>
          <button className="btn btn-outline-secondary btn-sm">Download PDF</button>
          <Link to="/admin/admin-management" className="btn btn-outline-primary btn-sm">
            Manage Admins
          </Link>
        </div>
        <p className="text-muted mb-0">ดาวน์โหลดรายงานยอดขายและการสต็อกเพื่อใช้งานต่อได้ทันที</p>
      </div>
    </div>
  );
};

export default ReportsPage;
