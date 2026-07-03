const InventoryPage = () => {
  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>Inventory</h3>
          <p className="text-muted">ตรวจสอบสต็อกสินค้าและมูลค่าสินค้าคงคลัง</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "Stock Items", value: "7,890" },
          { label: "Low Stock", value: "14" },
          { label: "Out of Stock", value: "3" },
          { label: "Inventory Value", value: "฿1,180,000" },
        ].map((item) => (
          <div key={item.label} className="col-12 col-sm-6 col-lg-3">
            <div className="admin-summary-card p-4 rounded shadow-sm h-100">
              <div className="text-uppercase text-secondary mb-2">{item.label}</div>
              <div className="display-6 fw-bold">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel p-4 rounded shadow-sm">
        <h5 className="mb-3">รายการสินค้าที่ใกล้หมด</h5>
        <div className="admin-table-placeholder">ตารางสต็อกสินค้า</div>
      </div>
    </div>
  );
};

export default InventoryPage;
