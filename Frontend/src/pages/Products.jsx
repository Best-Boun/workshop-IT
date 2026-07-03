import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORY_OPTIONS = ["Computer Set", "Notebook"];
const BRAND_OPTIONS = ["ASUS", "MSI", "Lenovo", "Dell", "HP", "Acer"];

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { name }
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("q") || "").trim();
  }, [location.search]);

  useEffect(() => {
    setLoading(true);

    const params = {};
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (searchQuery) params.q = searchQuery;

    const endpoint = searchQuery ? "/products/search" : "/products";

    api
      .get(endpoint, { params })
      .then((res) => setProducts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, brand, searchQuery]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // แสดง toast notification
    setToast(product.name);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #2563eb 60%, #0ea5e9 100%)",
          padding: "3rem 0 2.5rem",
          color: "#fff",
        }}
      >
        <div className="container">
          <p
            className="mb-1"
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            TechPulse · Store
          </p>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            All Products
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", marginBottom: 0 }}>
            {loading ? "Loading..." : `${products.length} products available`}
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="container py-5">
        {/* Back button */}
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill mb-4"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* Filters */}
        <div
          className="bg-white rounded-4 shadow-sm p-3 p-md-4 mb-4"
          style={{ border: "1px solid #e2e8f0" }}
        >
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <p className="text-uppercase text-primary small fw-semibold mb-0">
              Product Filters
            </p>
            {(category || brand) && (
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill"
                onClick={() => {
                  setCategory("");
                  setBrand("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-1">Category</label>
              <select
                className="form-select rounded-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-1">Brand</label>
              <select
                className="form-select rounded-3"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {BRAND_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "3rem", opacity: 0.3 }}>📦</div>
            <h5 className="mt-3">No products found</h5>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((product) => (
              <div className="col-sm-6 col-lg-4" key={product.id}>
                <div
                  className="card h-100 border-0 rounded-4 shadow-sm"
                  style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 36px rgba(15,23,42,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  {/* Product image */}
                  <div
                    style={{
                      height: 220,
                      borderRadius: "1rem 1rem 0 0",
                      overflow: "hidden",
                      background: "linear-gradient(180deg,#e0f2fe,#bae6fd 72%,#7dd3fc)",
                    }}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>

                  <div className="card-body d-flex flex-column p-4">
                    {/* Category badge */}
                    {product.category && (
                      <span
                        className="badge rounded-pill mb-2"
                        style={{
                          background: "rgba(37,99,235,0.1)",
                          color: "#2563eb",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          alignSelf: "flex-start",
                          padding: "0.35em 0.85em",
                        }}
                      >
                        {product.category}
                      </span>
                    )}

                    {product.warranty && (
                      <span
                        className="badge rounded-pill mb-2"
                        title={product.warranty_provider || "Warranty"}
                        style={{
                          background: "rgba(15,23,42,0.08)",
                          color: "#334155",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          alignSelf: "flex-start",
                          padding: "0.3em 0.75em",
                        }}
                      >
                        🛡 {product.warranty}
                      </span>
                    )}

                    <h5 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                      {product.name}
                    </h5>
                    <p className="text-muted small mb-2">{product.brand}</p>
                    <p
                      className="text-muted flex-grow-1"
                      style={{ fontSize: "0.85rem", lineHeight: 1.55 }}
                    >
                      {product.description}
                    </p>

                    {product.stock !== undefined && (
                      <p className="small mb-2" style={{ color: product.stock > 0 ? "#16a34a" : "#dc2626" }}>
                        {product.stock > 0 ? `✓ In stock (${product.stock})` : "✗ Out of stock"}
                      </p>
                    )}

                    <div className="d-flex align-items-center justify-content-between mt-2 mb-3">
                      <span className="fw-bold fs-5" style={{ color: "#2563eb" }}>
                        ฿{Number(product.price).toLocaleString()}
                      </span>
                    </div>

                    <button
                      className="btn btn-primary rounded-pill w-100 fw-semibold"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      className="btn btn-outline-secondary rounded-pill w-100 fw-semibold mt-2"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "#0f172a",
            color: "#fff",
            borderRadius: "0.75rem",
            padding: "0.85rem 1.25rem",
            boxShadow: "0 8px 24px rgba(15,23,42,0.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            animation: "fadeIn 0.25s ease",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          <span>🛒</span>
          <span>
            <strong>{toast}</strong> added to cart
          </span>
          <button
            className="btn btn-sm rounded-pill ms-2"
            style={{ background: "#2563eb", color: "#fff", fontSize: "0.75rem", padding: "0.2rem 0.75rem" }}
            onClick={() => navigate("/cart")}
          >
            View Cart
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Products;
