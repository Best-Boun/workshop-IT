import { useEffect, useState } from "react";
import { getLowStockProducts } from "../../../services/productService";

const LowStock = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getLowStockProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Error loading low stock products:", error);
      }
    };

    void loadProducts();
  }, []);

  const getStockBadge = (stock) => {
    if (stock === 0) return "bg-danger";
    if (stock >= 1 && stock <= 5) return "badge-stock-orange";
    if (stock >= 6 && stock <= 10) return "badge-stock-yellow";
    return "bg-success";
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="fw-bold mb-3">Low Stock Products</h5>

        {products.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="bi bi-check-circle fs-1 text-success"></i>
            <p className="mt-3 mb-0">No products are running low on stock.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th className="text-center">Current Stock</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>

                    <td>{product.brand}</td>

                    <td className="text-center">
                      <span className={`badge ${getStockBadge(product.stock)}`}>
                        {product.stock}
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

export default LowStock;
