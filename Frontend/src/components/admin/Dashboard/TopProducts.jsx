import { useEffect, useState } from "react";
import { getTopProducts } from "../../../services/reportService";

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getTopProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Error loading top products:", error);
      }
    };

    void loadProducts();
  }, []);

  const rankedProducts = [...products]
    .sort((a, b) => Number(b.quantity_sold || 0) - Number(a.quantity_sold || 0))
    .slice(0, 5);

  const maxRevenue = Math.max(
    ...rankedProducts.map((item) => Number(item.revenue || 0)),
    1,
  );

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Top Products</h5>
          <span className="text-muted small">Sorted by quantity sold</span>
        </div>

        {rankedProducts.length === 0 ? (
          <div className="text-center text-muted py-5">No product data</div>
        ) : (
          <div className="d-grid gap-3">
            {rankedProducts.map((product, index) => {
              const revenue = Number(product.revenue || 0);
              const progress = Math.round((revenue / maxRevenue) * 100);

              return (
                <div
                  key={`${product.product_name}-${index}`}
                  className="border rounded-3 p-3"
                >
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <h6 className="fw-semibold mb-1">
                        {product.product_name}
                      </h6>
                      <p className="text-muted small mb-0">
                        {product.quantity_sold} sold
                      </p>
                    </div>
                    <span className="fw-bold">฿{revenue.toLocaleString()}</span>
                  </div>

                  <div className="progress mt-3" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
