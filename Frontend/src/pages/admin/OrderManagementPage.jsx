const OrderManagementPage = () => {
  const orders = [
    { label: "New Orders", value: 28, badge: "ใหม่" },
    { label: "In Delivery", value: 42, badge: "จัดส่ง" },
    { label: "Delivered", value: 135, badge: "สำเร็จ" },
    { label: "Cancelled", value: 8, badge: "ยกเลิก" },
    { label: "Refunds", value: 5, badge: "คืนเงิน" },
  ];

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>Order Management</h3>
          <p className="text-muted">ติดตามสถานะคำสั่งซื้อและคืนสินค้า</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {orders.map((order) => (
          <div key={order.label} className="col-12 col-sm-6 col-lg-4">
            <div className="admin-summary-card p-4 rounded shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">{order.label}</h6>
                <span className="badge bg-primary">{order.badge}</span>
              </div>
              <div className="display-6 fw-bold">{order.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel p-4 rounded shadow-sm">
        <h5 className="mb-3">รายการคำสั่งซื้อล่าสุด</h5>
        <div className="admin-table-placeholder">ตารางคำสั่งซื้อ</div>
      </div>
    </div>
  );
};

export default OrderManagementPage;
