import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Checkout.css";

const DEFAULT_COUNTRY = "Thailand";

const deriveShippingCity = (address) => {
  const normalized = String(address || "").trim();

  if (!normalized) return "Thailand";

  const segments = normalized
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length >= 2) {
    return segments[segments.length - 2];
  }

  return segments[0] || "Thailand";
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem;
  const isBuyNowFlow = Boolean(buyNowItem && buyNowItem.id);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [shippingProfile, setShippingProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    country: DEFAULT_COUNTRY,
  });

  const [form, setForm] = useState({
    shipping_address: "",
    shipping_city: "",
    shipping_postal_code: "",
    shipping_country: DEFAULT_COUNTRY,
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

  useEffect(() => {
    const loadShippingProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const res = await api.get("/users/profile");
        const profile = res.data?.data || {};
        const nextAddress = profile.address || "";
        const nextCountry = DEFAULT_COUNTRY;

        setShippingProfile({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          phone: profile.phone ? String(profile.phone) : "",
          address: nextAddress,
          country: nextCountry,
        });

        setForm((prev) => ({
          ...prev,
          shipping_address: nextAddress,
          shipping_city: deriveShippingCity(nextAddress),
          shipping_country: nextCountry,
        }));
      } catch (err) {
        setProfileError(err.response?.data?.message || "Failed to load shipping address");
      } finally {
        setProfileLoading(false);
      }
    };

    loadShippingProfile();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!form.shipping_address.trim()) {
      setError("Please add your shipping address before checkout");
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
                    {profileLoading ? (
                      <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-primary" />
                      </div>
                    ) : profileError ? (
                      <div className="alert alert-danger rounded-3">{profileError}</div>
                    ) : form.shipping_address.trim() ? (
                      <div className="checkout-address-card">
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                          <div>
                            <h2 className="h5 fw-bold text-dark mb-1">Shipping Address</h2>
                            <p className="text-muted mb-0">
                              Your saved address from My Addresses will be used for this order.
                            </p>
                          </div>

                          <button
                            type="button"
                            className="btn btn-outline-primary rounded-pill px-4"
                            onClick={() => navigate("/my-account/addresses")}
                          >
                            Change
                          </button>
                        </div>

                        <div className="row g-4">
                          <div className="col-12 col-md-6">
                            <div className="small text-uppercase fw-semibold text-muted mb-2 checkout-address-label">
                              Recipient
                            </div>
                            <div className="fw-bold text-dark">
                              {shippingProfile.first_name} {shippingProfile.last_name}
                            </div>
                          </div>

                          <div className="col-12 col-md-6">
                            <div className="small text-uppercase fw-semibold text-muted mb-2 checkout-address-label">
                              Phone Number
                            </div>
                            <div className="text-dark">{shippingProfile.phone || "-"}</div>
                          </div>

                          <div className="col-12">
                            <div className="small text-uppercase fw-semibold text-muted mb-2 checkout-address-label">
                              Shipping Address
                            </div>
                            <div className="text-dark" style={{ whiteSpace: "pre-line" }}>
                              {shippingProfile.address}
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="small text-uppercase fw-semibold text-muted mb-2 checkout-address-label">
                              Country
                            </div>
                            <div className="text-dark">{shippingProfile.country}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="checkout-address-empty rounded-4">
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📍</div>
                        <h5 className="fw-bold text-dark mb-2">No shipping address found</h5>
                        <p className="text-muted mb-4">
                          Add your default shipping address in My Addresses before placing a new order.
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary rounded-pill px-4"
                          onClick={() => navigate("/my-account/addresses")}
                        >
                          Change
                        </button>
                      </div>
                    )}

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
