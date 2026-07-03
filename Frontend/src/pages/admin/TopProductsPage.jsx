const TopProductsPage = () => {
  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>Top Products</h3>
          <p className="text-muted">สินค้าขายดีและสินค้าสต็อกใกล้หมด</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="admin-panel p-4 rounded shadow-sm h-100">
            <h5 className="mb-3">สินค้าขายดีที่สุด</h5>
            <ol className="ps-3 mb-0">
              <li>Asus laptop</li>
              <li>Laptop Pro 15"</li>
              <li>Smartwatch Series 7</li>
            </ol>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="admin-panel p-4 rounded shadow-sm h-100">
            <h5 className="mb-3">สินค้าที่มียอดดูสูง</h5>
            <ol className="ps-3 mb-0">
              <li>Gaming Chair</li>
              <li>Wireless Earbuds</li>
              <li>4K Monitor</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="admin-panel p-4 rounded shadow-sm h-100">
            <h5 className="mb-3">ใกล้หมดสต็อก</h5>
            <ul className="list-unstyled mb-0">
              <li>• External SSD 1TB</li>
              <li>• Bluetooth Speaker</li>
              <li>• Gaming Mouse</li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="admin-panel p-4 rounded shadow-sm h-100">
            <h5 className="mb-3">สินค้าขายไม่ออก</h5>
            <ul className="list-unstyled mb-0">
              <li>• Desktop Lamp</li>
              <li>• USB Hub</li>
              <li>• Phone Case</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProductsPage;
