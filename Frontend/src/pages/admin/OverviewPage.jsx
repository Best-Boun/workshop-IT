const OverviewPage = () => {
  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>สรุปภาพรวม</h3>
          <p className="text-muted">ภาพรวมยอดขายและการเติบโตของธุรกิจ</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "Total Sales", value: "฿1,245,300", subtitle: "+12.4% จากก่อนหน้า" },
          { label: "Total Orders", value: "1,820", subtitle: "คำสั่งซื้อใหม่ 320 รายการ" },
          { label: "Total Customers", value: "1,135", subtitle: "ลูกค้าใหม่ 180 คน" },
          { label: "Products Sold", value: "4,560", subtitle: "สินค้าขายได้" },
          { label: "Net Profit", value: "฿345,900", subtitle: "กำไรสุทธิ" },
          { label: "Growth Rate", value: "+18.2%", subtitle: "เทียบกับช่วงก่อนหน้า" },
        ].map((card) => (
          <div key={card.label} className="col-12 col-sm-6 col-lg-4">
            <div className="admin-summary-card p-4 rounded shadow-sm h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0 text-uppercase text-secondary">{card.label}</h6>
              </div>
              <div className="display-6 fw-bold">{card.value}</div>
              <div className="text-muted mt-2">{card.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="admin-summary-panel p-4 rounded shadow-sm">
            <h5 className="mb-3">อัตราการเติบโต</h5>
            <p className="text-muted">
              ยอดขายเดือนนี้เพิ่มขึ้นเทียบกับเดือนก่อนหน้านี้ และจำนวนคำสั่งซื้อเพิ่มขึ้นอย่างต่อเนื่อง
            </p>
            <div className="progress" style={{ height: "14px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: "72%" }}
                aria-valuenow="72"
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="admin-summary-panel p-4 rounded shadow-sm">
            <h5 className="mb-3">ข้อมูลสำคัญ</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">• ยอดขายสูงสุด: หมวดเครื่องใช้ไฟฟ้า</li>
              <li className="mb-2">• ลูกค้าซื้อซ้ำสูงสุด: 24%</li>
              <li className="mb-2">• สินค้าใกล้หมดสต็อก: 12 รายการ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
