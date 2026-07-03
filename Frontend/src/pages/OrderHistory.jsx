import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/OrderHistory.css";

const statusClass = {
  pending: "status-pending",
  processing: "status-processing",
  shipped: "status-shipped",
  delivered: "status-delivered",
  cancelled: "status-cancelled",
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/orders/my")
      .then((res) => setOrders(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="history-page">
      <Navbar />

      {/* Hero */}
      <div className="history-hero">
        <div className="container">
          <div className="history-hero-label">TechPulse · Account</div>
          <h1>My Orders</h1>
          {!loading && !error && (
            <p className="mb-0 mt-1" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="history-main">
        <div className="container" style={{ maxWidth: 800 }}>
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div className="alert alert-danger rounded-3">{error}</div>
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📦</div>
              <h5 className="fw-bold text-dark mb-2">No orders yet</h5>
              <p className="text-muted mb-4">
                When you place orders, they'll appear here.
              </p>
              <button
                className="btn btn-primary rounded-pill px-5"
                onClick={() => navigate("/products")}
              >
                Shop Now
              </button>
            </div>
          ) : (
            <>
              <p className="text-uppercase text-primary small fw-semibold mb-3">
                Order History
              </p>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="order-row-card"
                  onClick={() => navigate(`/track/${order.id}`)}
                >
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <div className="order-id">Order #{order.id}</div>
                      <div className="order-date">
                        {new Date(order.created_at).toLocaleString("th-TH")}
                      </div>
                      <div className="text-muted small mt-1">
                        {order.item_count} item{order.item_count !== 1 ? "s" : ""}{" "}
                        · {order.shipping_city}, {order.shipping_country}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="order-amount mb-1">
                        ฿{Number(order.total_amount).toLocaleString()}
                      </div>
                      <span className={`status-badge ${statusClass[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;
