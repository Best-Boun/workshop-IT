const PaymentPage = () => {
  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>Payment</h3>
          <p className="text-muted">ติดตามสถานะการชำระเงินและช่องทางที่ลูกค้าใช้</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "Paid", value: "฿890,400" },
          { label: "Pending", value: "฿58,700" },
          { label: "Refunded", value: "฿12,900" },
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
