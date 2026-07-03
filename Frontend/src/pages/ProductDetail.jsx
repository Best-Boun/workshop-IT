import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Product not found");
        } else {
          setError(err.response?.data?.message || "Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const stock = Number(product?.stock || 0);
  const safeQty = useMemo(() => {
    if (stock <= 0) return 1;
    return Math.min(Math.max(quantity, 1), stock);
  }, [quantity, stock]);

  useEffect(() => {
    if (quantity !== safeQty) {
      setQuantity(safeQty);
    }
  }, [quantity, safeQty]);

  const increaseQty = () => {
    setQuantity((prev) => (stock > 0 ? Math.min(prev + 1, stock) : prev));
  };

  const decreaseQty = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleQtyInput = (e) => {
    const next = Number(e.target.value.replace(/\D/g, ""));
    if (!Number.isFinite(next) || next <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity(stock > 0 ? Math.min(next, stock) : next);
  };

  const readField = (...keys) => {
    for (const key of keys) {
      if (product?.[key] !== undefined && product?.[key] !== null && product?.[key] !== "") {
        return product[key];
      }
    }
    return "-";
  };

  const addToCart = () => {
    if (!product || stock <= 0) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += safeQty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity: safeQty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setToast(product.name);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="product-detail-hero">
        <div className="container">
          <div className="product-detail-hero-label">TechPulse · Store</div>
          <h1>Product Detail</h1>
          <p className="mb-0 mt-1 product-detail-hero-subtitle">
            Hardware specs and purchase options
          </p>
        </div>
      </div>

      <div className="product-detail-main">
        <div className="container">
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div className="product-detail-card text-center py-5">
              <h5 className="fw-bold mb-2">{error}</h5>
              <p className="text-muted mb-4">Please check the product URL or try again later.</p>
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={() => navigate("/products")}
              >
                Back to Products
              </button>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="product-detail-card product-image-card">
                  <div className="product-detail-image-wrap">
                    <img
                      src={product.image ? `http://localhost:5000/uploads/${product.image}` : null}
                      alt={product.name}
                      className="product-detail-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="product-detail-card h-100">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <span className="badge product-category-badge">
                      {product.category_name || product.category || "Uncategorized"}
                    </span>
                    <span className={`stock-pill ${stock > 0 ? "in" : "out"}`}>
                      {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
                    </span>
                  </div>

                  <h2 className="product-detail-title">{product.name}</h2>
                  <p className="product-detail-brand mb-2">{product.brand || "-"}</p>
                  <p className="product-detail-description">{product.description || "-"}</p>

                  <div className="product-detail-price mb-3">
                    ฿{Number(product.price || 0).toLocaleString()}
                  </div>

                  <div className="spec-grid mb-4">
                    <div className="spec-row"><span>CPU</span><strong>{readField("cpu", "CPU")}</strong></div>
                    <div className="spec-row"><span>GPU</span><strong>{readField("gpu", "GPU")}</strong></div>
                    <div className="spec-row"><span>RAM</span><strong>{readField("ram", "RAM")}</strong></div>
                    <div className="spec-row"><span>Storage</span><strong>{readField("storage", "ssd", "hdd")}</strong></div>
                    <div className="spec-row"><span>Display</span><strong>{readField("display", "screen", "display_size")}</strong></div>
                    <div className="spec-row"><span>Warranty</span><strong>{readField("warranty")}</strong></div>
                    <div className="spec-row"><span>Warranty Provider</span><strong>{readField("warranty_provider", "provider")}</strong></div>
                    <div className="spec-row"><span>Stock</span><strong>{stock}</strong></div>
                  </div>

                  <div className="purchase-row">
                    <div className="qty-control-box">
                      <button className="qty-btn" onClick={decreaseQty} disabled={stock <= 0}>
                        −
                      </button>
                      <input
                        className="qty-input"
                        value={safeQty}
                        onChange={handleQtyInput}
                        disabled={stock <= 0}
                      />
                      <button className="qty-btn" onClick={increaseQty} disabled={stock <= 0}>
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-primary rounded-pill px-4 fw-semibold"
                      onClick={addToCart}
                      disabled={stock <= 0}
                    >
                      🛒 Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {toast && (
        <div className="detail-toast">
          <span>🛒</span>
          <span>
            <strong>{toast}</strong> added to cart
          </span>
          <button
            className="btn btn-sm rounded-pill ms-2"
            onClick={() => navigate("/cart")}
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;