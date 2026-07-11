import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORY_OPTIONS = ["Computer Set", "Notebook"];




const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { name }
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [cartQtyMap, setCartQtyMap] = useState({});
  const [pendingMap, setPendingMap] = useState({});
  const [microActionMap, setMicroActionMap] = useState({});
  const [stockNoticeMap, setStockNoticeMap] = useState({});
  const [brands, setBrands] = useState([]);

  const categoryQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("category") || "").trim();
  }, [location.search]);

  const brandQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("brand") || "").trim();
  }, [location.search]);

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("q") || "").trim();
  }, [location.search]);

  useEffect(() => {
    setCategory(categoryQuery);
  }, [categoryQuery]);

  useEffect(() => {
    setBrand(brandQuery);
  }, [brandQuery]);

  useEffect(() => {
    setLoading(true);

    const params = {};
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (searchQuery) params.q = searchQuery;

    const endpoint = searchQuery ? "/products/search" : "/products/store";

    api
      .get(endpoint, { params })
      .then((res) => setProducts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, brand, searchQuery]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    const qtyMap = saved.reduce((acc, item) => {
      acc[item.id] = Number(item.quantity) || 0;
      return acc;
    }, {});
    setCartQtyMap(qtyMap);
  }, []);

  useEffect(() => {
    api
      .get("/products/brands")
      .then((res) => setBrands(res.data.data))
      .catch(console.error);
  }, []);

  const setPending = (productId, value) => {
    setPendingMap((prev) => ({ ...prev, [productId]: value }));
  };

  const animateFlyToCart = (imageElement) => {
    if (!imageElement) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cartTarget = document.querySelector(".js-cart-target");
    if (!cartTarget) return;

    const imageRect = imageElement.getBoundingClientRect();
    const targetRect = cartTarget.getBoundingClientRect();

    const flyImage = imageElement.cloneNode(true);
    const startSize = Math.max(40, Math.min(imageRect.width, imageRect.height));

    flyImage.style.position = "fixed";
    flyImage.style.left = `${imageRect.left + (imageRect.width - startSize) / 2}px`;
    flyImage.style.top = `${imageRect.top + (imageRect.height - startSize) / 2}px`;
    flyImage.style.width = `${startSize}px`;
    flyImage.style.height = `${startSize}px`;
    flyImage.style.objectFit = "cover";
    flyImage.style.borderRadius = "0.75rem";
    flyImage.style.pointerEvents = "none";
    flyImage.style.zIndex = "99999";
    flyImage.style.opacity = "0.95";
    flyImage.style.transform = "translate3d(0,0,0) scale(1)";
    flyImage.style.willChange = "transform, opacity";
    flyImage.style.boxShadow = "0 12px 30px rgba(15,23,42,0.25)";
    flyImage.style.transition = "transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 600ms ease";

    document.body.appendChild(flyImage);

    const targetX = targetRect.left + targetRect.width / 2 - (imageRect.left + imageRect.width / 2);
    const targetY = targetRect.top + targetRect.height / 2 - (imageRect.top + imageRect.height / 2);

    requestAnimationFrame(() => {
      flyImage.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(0.2)`;
      flyImage.style.opacity = "0";
    });

    const cleanup = () => {
      flyImage.remove();
    };

    flyImage.addEventListener("transitionend", cleanup, { once: true });
    setTimeout(cleanup, 650);
  };

  const getCartSnapshot = () => JSON.parse(localStorage.getItem("cart") || "[]");

  const writeCartSnapshot = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getQuantityFromSnapshot = (cart, productId) => {
    const found = cart.find((item) => item.id === productId);
    return found ? Number(found.quantity) || 0 : 0;
  };

  const applyQuantityToSnapshot = (cart, product, nextQty) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (nextQty <= 0) {
      if (existingIndex >= 0) {
        cart.splice(existingIndex, 1);
      }
      return cart;
    }

    if (existingIndex >= 0) {
      cart[existingIndex].quantity = nextQty;
      return cart;
    }

    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: nextQty,
    });

    return cart;
  };

  const syncCartInBackground = async (product, prevQty, nextQty) => {
    // Reuse cart APIs if available in backend. If endpoint is not present,
    // keep local cart state as the source of truth for compatibility.
    const requests = [];

    if (prevQty === 0 && nextQty > 0) {
      requests.push(() => api.post("/cart", { product_id: product.id, quantity: nextQty }));
      requests.push(() => api.post("/cart/add", { product_id: product.id, quantity: nextQty }));
      requests.push(() => api.post("/cart/items", { product_id: product.id, quantity: nextQty }));
    } else if (prevQty > 0 && nextQty > 0) {
      requests.push(() => api.put(`/cart/${product.id}`, { quantity: nextQty }));
      requests.push(() => api.put(`/cart/items/${product.id}`, { quantity: nextQty }));
      requests.push(() => api.patch(`/cart/${product.id}`, { quantity: nextQty }));
    } else {
      requests.push(() => api.delete(`/cart/${product.id}`));
      requests.push(() => api.delete(`/cart/items/${product.id}`));
      requests.push(() => api.post("/cart/remove", { product_id: product.id }));
    }

    let lastError = null;
    for (const makeRequest of requests) {
      try {
        await makeRequest();
        return;
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError && lastError.response && lastError.response.status === 404) {
      return;
    }

    throw lastError || new Error("Cart sync failed");
  };

  const updateProductQuantity = async (product, nextQty) => {
    const previousSnapshot = getCartSnapshot();
    const prevQty = getQuantityFromSnapshot(previousSnapshot, product.id);
    const stock = Math.max(0, Number(product.stock) || 0);
    const boundedNextQty = Math.max(0, Math.min(nextQty, stock));

    if (prevQty === boundedNextQty) return;

    const optimisticSnapshot = applyQuantityToSnapshot(
      [...previousSnapshot],
      product,
      boundedNextQty,
    );

    setCartQtyMap((prev) => ({ ...prev, [product.id]: boundedNextQty }));
    writeCartSnapshot(optimisticSnapshot);
    setPending(product.id, true);

    if (boundedNextQty > prevQty) {
      setToast(product.name);
      setTimeout(() => setToast(null), 2200);
    }

    try {
      await syncCartInBackground(product, prevQty, boundedNextQty);
    } catch (error) {
      setCartQtyMap((prev) => ({ ...prev, [product.id]: prevQty }));
      writeCartSnapshot(previousSnapshot);
    } finally {
      setPending(product.id, false);
    }
  };

  const addToCart = (product) => {
    const stock = Math.max(0, Number(product.stock) || 0);
    const currentQty = Number(cartQtyMap[product.id] || 0);

    if (stock > 0 && currentQty >= stock) {
      setStockNoticeMap((prev) => ({
        ...prev,
        [product.id]: `Only ${stock} items available.`,
      }));
      return;
    }

    setStockNoticeMap((prev) => {
      if (!prev[product.id]) return prev;
      const next = { ...prev };
      delete next[product.id];
      return next;
    });

    updateProductQuantity(product, currentQty + 1);
  };

  const triggerMicroAction = (productId, action) => {
    setMicroActionMap((prev) => ({ ...prev, [productId]: action }));

    setTimeout(() => {
      setMicroActionMap((prev) => {
        if (prev[productId] !== action) return prev;
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }, 180);
  };

  const handleAddToCartClick = (event, product) => {
    const cardImage = event.currentTarget
      .closest(".card")
      ?.querySelector("img");

    animateFlyToCart(cardImage);
    addToCart(product);
  };

  const increaseQty = (product) => {
    const stock = Math.max(0, Number(product.stock) || 0);
    const currentQty = Number(cartQtyMap[product.id] || 0);

    if (stock > 0 && currentQty >= stock) {
      setStockNoticeMap((prev) => ({
        ...prev,
        [product.id]: `Only ${stock} items available.`,
      }));
      return;
    }

    setStockNoticeMap((prev) => {
      if (!prev[product.id]) return prev;
      const next = { ...prev };
      delete next[product.id];
      return next;
    });

    updateProductQuantity(product, currentQty + 1);
  };

  const decreaseQty = (product) => {
    const currentQty = Number(cartQtyMap[product.id] || 0);

    setStockNoticeMap((prev) => {
      if (!prev[product.id]) return prev;
      const next = { ...prev };
      delete next[product.id];
      return next;
    });

    updateProductQuantity(product, currentQty - 1);
  };

  const handleIncreaseQtyClick = (product) => {
    triggerMicroAction(product.id, "plus");
    increaseQty(product);
  };

  const handleDecreaseQtyClick = (product) => {
    triggerMicroAction(product.id, "minus");
    decreaseQty(product);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #2563eb 60%, #0ea5e9 100%)",
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
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "0.25rem",
            }}
          >
            All Products
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.9rem",
              marginBottom: 0,
            }}
          >
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
              <label className="form-label fw-semibold text-dark mb-1">
                Category
              </label>
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
              <label className="form-label fw-semibold text-dark mb-1">
                Brand
              </label>
              <select
                className="form-select rounded-3"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map((item) => (
                  <option key={item.brand} value={item.brand}>
                    {item.brand}
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
            {products.map((product) =>
              (() => {
                const stock = Math.max(0, Number(product.stock) || 0);
                const currentQty = Number(cartQtyMap[product.id] || 0);
                const isMaxInCart = stock > 0 && currentQty >= stock;

                return (
                  <div className="col-sm-6 col-lg-4" key={product.id}>
                    <div
                      className="card h-100 border-0 rounded-4 shadow-sm"
                      style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 36px rgba(15,23,42,0.12)";
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
                          background:
                            "linear-gradient(180deg,#e0f2fe,#bae6fd 72%,#7dd3fc)",
                        }}
                      >
                        <img
                          src={`http://localhost:5000/uploads/${product.image}`}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
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

                        <h5
                          className="fw-bold mb-1"
                          style={{ color: "#0f172a" }}
                        >
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
                          <p
                            className="small mb-2"
                            style={{
                              color: product.stock > 0 ? "#16a34a" : "#dc2626",
                            }}
                          >
                            {product.stock > 0
                              ? `✓ In stock (${product.stock})`
                              : "✗ Out of stock"}
                          </p>
                        )}

                        <div className="d-flex align-items-center justify-content-between mt-2 mb-3">
                          <span
                            className="fw-bold fs-5"
                            style={{ color: "#2563eb" }}
                          >
                            ฿{Number(product.price).toLocaleString()}
                          </span>
                        </div>

                        <div className="cart-action-shell">
                          {currentQty === 0 ? (
                            <div
                              key="add"
                              className="cart-action-switch cart-action-add-wrap"
                            >
                              <button
                                className="btn btn-primary rounded-pill w-100 fw-semibold"
                                onClick={(event) =>
                                  handleAddToCartClick(event, product)
                                }
                                disabled={
                                  stock === 0 ||
                                  pendingMap[product.id] ||
                                  isMaxInCart
                                }
                                aria-label={`Add ${product.name} to cart`}
                              >
                                🛒 Add to Cart
                              </button>
                            </div>
                          ) : (
                            <div
                              key="qty"
                              className="cart-action-switch cart-action-qty-wrap"
                            >
                              <div
                                className="cart-qty-control"
                                role="group"
                                aria-label={`${product.name} quantity in cart`}
                              >
                                <button
                                  className={`cart-qty-btn ${microActionMap[product.id] === "minus" ? "cart-qty-btn--active" : ""}`}
                                  onClick={() =>
                                    handleDecreaseQtyClick(product)
                                  }
                                  disabled={pendingMap[product.id]}
                                  aria-label={`Decrease ${product.name} quantity`}
                                >
                                  −
                                </button>

                                <div
                                  className="cart-qty-text"
                                  aria-live="polite"
                                >
                                  <span
                                    className={`cart-qty-icon ${microActionMap[product.id] === "plus" ? "cart-qty-icon--bounce" : ""}`}
                                  >
                                    🛒
                                  </span>
                                  <span
                                    key={`${product.id}-${cartQtyMap[product.id]}-${microActionMap[product.id] || "steady"}`}
                                    className={`cart-qty-number ${microActionMap[product.id] === "plus" ? "cart-qty-number--plus" : ""} ${microActionMap[product.id] === "minus" ? "cart-qty-number--minus" : ""}`}
                                  >
                                    {cartQtyMap[product.id]}
                                  </span>
                                  <span>in Cart</span>
                                </div>

                                <button
                                  className={`cart-qty-btn ${microActionMap[product.id] === "plus" ? "cart-qty-btn--active" : ""}`}
                                  onClick={() =>
                                    handleIncreaseQtyClick(product)
                                  }
                                  disabled={
                                    pendingMap[product.id] || isMaxInCart
                                  }
                                  aria-label={`Increase ${product.name} quantity`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}

                          {isMaxInCart && (
                            <p
                              className="small text-warning mb-0 mt-2 fw-semibold"
                              aria-live="polite"
                            >
                              Maximum stock reached
                            </p>
                          )}

                          {!isMaxInCart && stockNoticeMap[product.id] && (
                            <p
                              className="small text-warning mb-0 mt-2 fw-semibold"
                              aria-live="polite"
                            >
                              {stockNoticeMap[product.id]}
                            </p>
                          )}
                        </div>

                        <button
                          className="btn btn-outline-secondary rounded-pill w-100 fw-semibold mt-2"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })(),
            )}
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
            style={{
              background: "#2563eb",
              color: "#fff",
              fontSize: "0.75rem",
              padding: "0.2rem 0.75rem",
            }}
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

        .cart-action-shell {
          min-height: 42px;
        }

        .cart-action-switch {
          animation: cartFadeScale 220ms ease;
          transform-origin: center;
        }

        @keyframes cartFadeScale {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .cart-qty-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border: 1px solid rgba(37, 99, 235, 0.18);
          background: #eff6ff;
          border-radius: 999px;
          padding: 0.26rem 0.35rem;
          gap: 0.35rem;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .cart-qty-control:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.16);
        }

        .cart-qty-btn {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 800;
          line-height: 1;
          color: #1d4ed8;
          background: #fff;
          transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
        }

        .cart-qty-btn:hover:not(:disabled) {
          transform: translateY(-1px) scale(1.04);
          background: #dbeafe;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .cart-qty-btn--active {
          transform: scale(1.08);
        }

        .cart-qty-btn:disabled {
          opacity: 0.55;
        }

        .cart-qty-text {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.32rem;
          color: #1e3a8a;
          font-size: 0.84rem;
          font-weight: 700;
          min-width: 118px;
          text-align: center;
          user-select: none;
        }

        .cart-qty-icon {
          font-size: 0.9rem;
          display: inline-block;
          transition: transform 180ms ease;
        }

        .cart-qty-icon--bounce {
          transform: translateY(-1px) scale(1.16);
        }

        .cart-qty-number {
          display: inline-block;
          animation: qtyPop 180ms ease;
          min-width: 0.75rem;
        }

        .cart-qty-number--minus {
          animation: qtyDown 180ms ease;
        }

        @keyframes qtyPop {
          0% { transform: scale(0.86); opacity: 0.7; }
          65% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes qtyDown {
          0% { transform: translateY(-2px) scale(1.02); opacity: 0.85; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Products;
