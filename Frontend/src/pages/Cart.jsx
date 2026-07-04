import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [stockMessageById, setStockMessageById] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      if (cart.length === 0) {
        setStockMap({});
        return;
      }

      const entries = await Promise.all(
        cart.map(async (item) => {
          try {
            const res = await api.get(`/products/${item.id}`);
            const stock = Math.max(0, Number(res.data?.data?.stock) || 0);
            return [item.id, stock];
          } catch {
            return [item.id, null];
          }
        }),
      );

      setStockMap(Object.fromEntries(entries));
    };

    fetchStocks();
  }, [cart]);

  const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQty = (id, delta) => {
    const stock = stockMap[id];

    if (delta > 0 && Number.isFinite(stock)) {
      const item = cart.find((entry) => entry.id === id);
      const currentQty = item ? Number(item.quantity) || 0 : 0;

      if (currentQty >= stock) {
        setStockMessageById((prev) => ({
          ...prev,
          [id]: stock > 0 ? `Only ${stock} items available.` : "Maximum stock reached",
        }));
        return;
      }
    }

    setStockMessageById((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });

    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item,
      )
      .filter((item) => item.quantity > 0);
    saveCart(updated);
  };

  const removeItem = (id) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = cart.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <Navbar />

      {/* Page Hero */}
      <div className="cart-hero">
        <div className="container">
          <div className="cart-hero-label">TechPulse · Shopping</div>
          <h1>My Cart</h1>
          <p className="mb-0 mt-1" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </div>

      <div className="cart-main">
        <div className="container">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h4 className="fw-bold text-dark mb-2">Your cart is empty</h4>
              <p className="text-muted mb-4">
                Add products to your cart to get started.
              </p>
              <button
                className="btn btn-primary rounded-pill px-5"
                onClick={() => navigate("/products")}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {/* Cart items */}
              <div className="col-lg-8">
                <p className="text-uppercase text-primary small fw-semibold mb-3">
                  Order Items
                </p>

                {cart.map((item) => (
                  (() => {
                    const stock = stockMap[item.id];
                    const currentQty = Number(item.quantity) || 0;
                    const isMax = Number.isFinite(stock) && currentQty >= stock;

                    return (
                  <div className="cart-item-card" key={item.id}>
                    <img
                      src={
                        item.image
                          ? `http://localhost:5000/uploads/${item.image}`
                          : null
                      }
                      alt={item.name}
                      className="cart-item-img"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />

                    <div className="flex-grow-1">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-brand">{item.brand}</div>
                      <button
                        className="btn-remove mt-1"
                        onClick={() => removeItem(item.id)}
                      >
                        ✕ Remove
                      </button>
                    </div>

                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, +1)}
                        disabled={isMax}
                      >
                        +
                      </button>
                    </div>

                    {(isMax || stockMessageById[item.id]) && (
                      <div className="small text-warning fw-semibold mt-1" style={{ minWidth: 150 }}>
                        {isMax ? "Maximum stock reached" : stockMessageById[item.id]}
                      </div>
                    )}

                    <div className="cart-item-price">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                    );
                  })()
                ))}
              </div>

              {/* Summary */}
              <div className="col-lg-4">
                <div className="cart-summary-card">
                  <div className="summary-heading">Order Summary</div>

                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>฿{shipping.toLocaleString()}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>฿{total.toLocaleString()}</span>
                  </div>

                  <button
                    className="btn btn-primary rounded-pill w-100 mt-4 py-2 fw-semibold"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout →
                  </button>

                  <button
                    className="btn btn-outline-secondary rounded-pill w-100 mt-2 py-2"
                    onClick={() => navigate("/products")}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
