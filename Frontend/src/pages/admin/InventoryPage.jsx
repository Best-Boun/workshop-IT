import { useEffect, useState } from "react";
import api from "../../api/axios";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/products"),
      api.get("/admin/stats"),
    ])
      .then(([prodRes, statsRes]) => {
        setProducts(prodRes.data.data);
        setStats(statsRes.data.data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <h3>Inventory</h3>
        <p className="text-muted">ตรวจสอบสต็อกสินค้าและมูลค่าสินค้าคงคลัง</p>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "Stock Items", value: stats?.total_products ?? "…" },
          { label: "Low Stock (≤5)", value: stats?.low_stock ?? "…" },
          { label: "Out of Stock", value: stats?.out_of_stock ?? "…" },
          { label: "Inventory Value", value: stats ? `฿${Number(stats.inventory_value||0).toLocaleString()}` : "…" },
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
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0">รายการสินค้าทั้งหมด</h5>
          <input
            className="form-control form-control-sm rounded-pill"
            style={{ maxWidth: 280 }}
            placeholder="Search product or brand…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="d-flex justify-content-center py-4"><div className="spinner-border text-primary"/></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr><th>SKU</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="small text-muted">{p.sku}</td>
                    <td className="fw-semibold">{p.name}</td>
                    <td>{p.brand}</td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary">{p.category}</span></td>
                    <td className="text-primary fw-bold">฿{Number(p.price).toLocaleString()}</td>
                    <td>
                      <span className={`fw-bold ${p.stock === 0 ? "text-danger" : p.stock <= 5 ? "text-warning" : "text-success"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${p.stock === 0 ? "bg-danger" : p.stock <= 5 ? "bg-warning text-dark" : "bg-success"}`}>
                        {p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
