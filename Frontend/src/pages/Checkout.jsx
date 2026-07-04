import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem;
  const isBuyNowFlow = Boolean(buyNowItem && buyNowItem.id);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    shipping_address: "",
    shipping_city: "",
    shipping_postal_code: "",
    shipping_country: "Thailand",
  });

  useEffect(() => {
    if (isBuyNowFlow) {
      setCart([
        {
          id: buyNowItem.id,
          name: buyNowItem.name,
          brand: buyNowItem.brand,
          price: Number(buyNowItem.price) || 0,
          image: buyNowItem.image,
          quantity: Number(buyNowItem.quantity) > 0 ? Number(buyNowItem.quantity) : 1,
        },
      ]);
      return;
    }

    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, [isBuyNowFlow, buyNowItem]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/orders", {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: total,
        ...form,
      });

      const orderId = res.data.data.orderId;

      if (!isBuyNowFlow) {
        // Cart will be cleared after payment succeeds (in Payment.jsx)
      }

      navigate(`/payment/${orderId}`, { state: { total } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />

      {/* Hero */}
      <div className="checkout-hero">
        <div className="container">
          <div className="checkout-hero-label">TechPulse · Shopping</div>
          <h1>Checkout</h1>
          <p className="mb-0 mt-1" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
            Review your order and enter shipping details
          </p>
        </div>
      </div>

      <div className="checkout-main">
        <div className="container">
          {cart.length === 0 ? (
            <div className="checkout-card">
              <div className="empty-cart-msg">
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
                <h5 className="fw-bold text-dark mb-2">Your cart is empty</h5>
                <p className="text-muted mb-4">Add items before checking out.</p>
                <button
                  className="btn btn-primary rounded-pill px-5"
                  onClick={() => navigate("/products")}
                >
                  Browse Products
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {/* Shipping form */}
              <div className="col-lg-7">
                <div className="checkout-card">
                  <p className="section-heading">Shipping Address</p>
                  <form onSubmit={handleSubmit} id="checkout-form">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">
                        Address
                      </label>
                      <input
                        className="form-control rounded-3"
                        name="shipping_address"
                        placeholder="123 Main Street"
                        value={form.shipping_address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold text-dark">
                          City
                        </label>
                        <input
                          className="form-control rounded-3"
                          name="shipping_city"
                          placeholder="Bangkok"
                          value={form.shipping_city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold text-dark">
                          Postal Code
                        </label>
                        <input
                          className="form-control rounded-3"
                          name="shipping_postal_code"
                          placeholder="10110"
                          value={form.shipping_postal_code}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">
                        Country
                      </label>
                      <input
                        className="form-control rounded-3"
                        name="shipping_country"
                        value={form.shipping_country}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {error && (
                      <div className="alert alert-danger rounded-3 py-2">
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Order summary */}
              <div className="col-lg-5">
                <div className="checkout-card">
                  <p className="section-heading">Order Summary</p>

                  {cart.map((item) => (
                    <div className="order-item-row" key={item.id}>
                      <img
                        src={
                          item.image
                            ? `http://localhost:5000/uploads/${item.image}`
                            : null
                        }
                        alt={item.name}
                        className="order-item-img"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div className="flex-grow-1">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-meta">
                          ฿{Number(item.price).toLocaleString()} × {item.quantity}
                        </div>
                      </div>
                      <div className="fw-bold text-primary">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}

                  <div className="mt-3">
                    <div className="order-total-row">
                      <span>Subtotal</span>
                      <span>฿{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="order-total-row">
                      <span>Shipping</span>
                      <span>฿{shipping.toLocaleString()}</span>
                    </div>
                    <div className="order-total-row grand-total">
                      <span>Total</span>
                      <span>฿{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="checkout-form"
                    className="btn btn-primary rounded-pill w-100 mt-4 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Payment →"
                    )}
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

export default Checkout;
