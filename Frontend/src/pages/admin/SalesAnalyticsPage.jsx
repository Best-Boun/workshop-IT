const SalesAnalyticsPage = () => {
  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>Sales Analytics</h3>
          <p className="text-muted">ติดตามยอดขายรายวัน รายสัปดาห์ และรายเดือน</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="admin-panel p-4 rounded shadow-sm">
            <h5 className="mb-3">ยอดขายตามช่วงเวลา</h5>
            <div className="d-flex gap-2 flex-wrap mb-3">
              <button className="btn btn-outline-primary btn-sm active">Daily</button>
              <button className="btn btn-outline-primary btn-sm">Weekly</button>
              <button className="btn btn-outline-primary btn-sm">Monthly</button>
            </div>
            <div className="admin-chart-line">
              <div className="chart-grid">
                { [70, 85, 72, 96, 88, 110, 125].map((value, index) => (
                  <div key={index} className="chart-point" style={{ bottom: `${value}%` }}>
                    <span>{value}k</span>
                  </div>
                )) }
                <svg viewBox="0 0 100 100" className="chart-line-svg">
                  <polyline points="10,30 25,20 40,25 55,15 70,22 85,10 90,5" />
                </svg>
              </div>
              <div className="chart-axis-labels d-flex justify-content-between text-muted small mt-3">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="admin-panel p-4 rounded shadow-sm h-100">
            <h5 className="mb-3">ยอดขายตามหมวดหมู่</h5>
            <div className="chart-bars">
              {[
                { label: "Asus", value: 85 },
                { label: "DELL", value: 65 },
                { label: "Lenovo", value: 50 },
                { label: "MSI", value: 35 },
              ].map((item) => (
                <div key={item.label} className="chart-bar-row">
                  <div className="bar-label">{item.label}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${item.value}%` }} />
                  </div>
                  <div className="bar-value">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="admin-panel p-4 rounded shadow-sm h-100">
            <h5 className="mb-3">ยอดขายตามช่องทางชำระเงิน</h5>
            <div className="chart-pie-wrapper">
              <div className="chart-pie-chart">
                <span className="chart-pie-center">100%</span>
                <div className="pie-slice slice-1" />
                <div className="pie-slice slice-2" />
                <div className="pie-slice slice-3" />
                <div className="pie-slice slice-4" />
              </div>
              <div className="chart-pie-legend">
                <div><span className="legend-dot bg-primary" /> Credit Card 45%</div>
                <div><span className="legend-dot bg-success" /> Mobile Banking 30%</div>
                <div><span className="legend-dot bg-secondary" /> COD 10%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12">
          <div className="admin-panel p-4 rounded shadow-sm">
            <h5 className="mb-3">ยอดขายตามพื้นที่ / จังหวัด</h5>
            <div className="admin-chart-placeholder">กราฟแผนที่หรือพื้นที่</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsPage;
