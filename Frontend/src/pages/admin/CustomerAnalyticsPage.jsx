const CustomerAnalyticsPage = () => {
  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>Customer Analytics</h3>
          <p className="text-muted">วิเคราะห์ลูกค้าใหม่ ลูกค้าเก่า และลูกค้าที่ซื้อซ้ำ</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "New Customers", value: 120 },
          { label: "Returning Customers", value: 315 },
          { label: "Repeat Buyers", value: 118 },
          { label: "Top Customer", value: "คุณสมชาย" },
          { label: "Registered Users", value: 1_425 },
        ].map((item) => (
          <div key={item.label} className="col-12 col-sm-6 col-lg-4">
            <div className="admin-summary-card p-4 rounded shadow-sm h-100">
              <div className="text-uppercase text-secondary mb-2">{item.label}</div>
              <div className="display-6 fw-bold">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel p-4 rounded shadow-sm">
        <h5 className="mb-3">ลูกค้าที่ซื้อซ้ำ</h5>
        <div className="admin-chart-placeholder">กราฟลูกค้าซื้อซ้ำ</div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsPage;
