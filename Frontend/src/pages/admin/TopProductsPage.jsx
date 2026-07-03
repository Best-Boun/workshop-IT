import { useEffect, useState } from "react";
import api from "../../api/axios";

const TopProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/top-products")
      .then((res) => setProducts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const maxSold = products[0]?.total_sold || 1;

  return (
    <div>
      <div className="mb-4">
        <h3>Top Products</h3>
        <p className="text-muted">สินค้าขายดีที่สุด 10 อันดับแรก</p>
      </div>

      <div className="admin-panel p-4 rounded shadow-sm">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted py-5">ยังไม่มีข้อมูลยอดขาย</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                  <th>Popularity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.product_id}>
                    <td>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="text-muted">{i + 1}</span>}
                    </td>
                    <td className="fw-semibold">{p.product_name}</td>
                    <td>{p.brand || "—"}</td>
                    <td className="text-primary fw-bold">฿{Number(p.price).toLocaleString()}</td>
                    <td>
                      <span className="badge bg-primary rounded-pill">{Number(p.total_sold).toLocaleString()} units</span>
                    </td>
                    <td className="fw-bold text-success">฿{Number(p.total_revenue).toLocaleString()}</td>
                    <td style={{ minWidth: 150 }}>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: 8 }}>
                          <div
                            className="progress-bar bg-primary"
                            style={{ width: `${(p.total_sold / maxSold) * 100}%` }}
                          />
                        </div>
                        <span className="small text-muted">{Math.round((p.total_sold / maxSold) * 100)}%</span>
                      </div>
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

export default TopProductsPage;
