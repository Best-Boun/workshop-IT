import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/TrackOrder.css";

const STEPS = [
  { key: "pending",    label: "Pending",    icon: "🕐" },
  { key: "processing", label: "Processing", icon: "⚙️" },
  { key: "shipped",    label: "Shipped",    icon: "🚚" },
  { key: "delivered",  label: "Delivered",  icon: "✅" },
];

const ORDER_INDEX = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Order not found");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      setCancelling(true);
      await api.put(`/orders/${id}/cancel`);
      setOrder((prev) => ({ ...prev, status: "cancelled" }));
    } catch (err) {
      alert(err.response?.data?.message || "Cannot cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="track-page">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="spinner-border text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-page">
        <Navbar />
        <div className="track-main">
          <div className="container" style={{ maxWidth: 760 }}>
            <div className="alert alert-danger rounded-3">{error}</div>
            <button className="btn btn-outline-secondary rounded-pill" onClick={() => navigate("/orders")}>
              ← Back to Orders
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStep =
  ORDER_INDEX[order.status?.toLowerCase()] ?? 0;
console.log("status =", order.status);
console.log("status lower =", order.status?.toLowerCase());
console.log("currentStep =", currentStep);
console.log("ORDER_INDEX =", ORDER_INDEX);
  return (
    <div className="track-page">
      <Navbar />

      {/* Hero */}
      <div className="track-hero">
        <div className="container">
          <div className="track-hero-label">TechPulse · Order Tracking</div>
          <h1>Order #{order.id}</h1>
          <p className="mb-0 mt-1" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
            {new Date(order.created_at).toLocaleString("th-TH")}
          </p>
        </div>
      </div>

      <div className="track-main">
        <div className="container" style={{ maxWidth: 760 }}>
          {/* Back button */}
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill mb-4"
            onClick={() => navigate("/orders")}
          >
            ← Back to Orders
          </button>

          {/* Timeline */}
          <div className="track-card">
            <div className="section-label">Order Status</div>
            {order.status?.toLowerCase() === "cancelled"? (
              <div className="alert alert-danger rounded-3 mb-0 text-center fw-bold">
                ❌ This order has been cancelled
              </div>
            ) : (
              <div className="timeline">
                {STEPS.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isActive = idx === currentStep;
                  return (
                    <div className="timeline-step" key={step.key}>
                      <div
                        className={`timeline-circle ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                      >
                        {isDone ? "✓" : step.icon}
                      </div>
                      <div className={`timeline-label ${isActive ? "active" : ""}`}>
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="track-card">
            <div className="section-label">Items</div>
            {order.items?.map((item) => (
              <div className="track-item-row" key={item.id}>
                <img
                  src={item.image ? `http://localhost:5000/uploads/${item.image}` : null}
                  alt={item.name}
                  className="track-item-img"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div className="flex-grow-1">
                  <div className="fw-semibold text-dark">{item.name}</div>
                  <div className="text-muted small">{item.brand} · Qty {item.quantity}</div>
                </div>
                <div className="fw-bold text-primary">
                  ฿{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
            <div className="mt-3 pt-3 border-top d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span className="text-primary">฿{Number(order.total_amount).toLocaleString()}</span>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="track-card">
                <div className="section-label">Shipping Address</div>
                <div className="info-row"><span>Address</span><span>{order.shipping_address}</span></div>
                <div className="info-row"><span>City</span><span>{order.shipping_city}</span></div>
                <div className="info-row"><span>Postal</span><span>{order.shipping_postal_code || "—"}</span></div>
                <div className="info-row"><span>Country</span><span>{order.shipping_country}</span></div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="track-card">
                <div className="section-label">Payment</div>
                {order.payment ? (
                  <>
                    <div className="info-row"><span>Method</span><span>{order.payment.payment_method}</span></div>
                    <div className="info-row">
                      <span>Status</span>
                      <span className={`fw-bold ${order.payment.status === "completed" ? "text-success" : "text-danger"}`}>
                        {order.payment.status}
                      </span>
                    </div>
                    <div className="info-row">
                      <span>Txn ID</span>
                      <span className="small text-muted" style={{ wordBreak: "break-all" }}>
                        {order.payment.transaction_id}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-muted small">No payment record</div>
                )}
              </div>
            </div>
          </div>

          {/* Cancel */}
          {["pending", "processing"].includes(
  order.status?.toLowerCase()
) && (
            <div className="text-end mt-2">
              <button
                className="btn btn-outline-danger rounded-pill"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
