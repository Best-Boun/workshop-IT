import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/TrackOrder.css";
import "../css/OrdersModule.css";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import PaymentBadge from "../components/orders/PaymentBadge";
import ShippingTimeline from "../components/orders/ShippingTimeline";
import ProductRow from "../components/orders/ProductRow";
import ShippingCard from "../components/orders/ShippingCard";
import PaymentCard from "../components/orders/PaymentCard";
import OrderSummaryCard from "../components/orders/OrderSummaryCard";
import {
  formatOrderDate,
  getEstimatedDeliveryLabel,
  formatCurrency,
  getPrimaryOrderItem,
  normalizeStatus,
} from "../utils/orders";

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

  const normalizedStatus = normalizeStatus(order.status);
  const primaryItem = getPrimaryOrderItem(order.items);

  const handleProductNavigation = (item = primaryItem) => {
    if (item?.product_id) {
      navigate(`/products/${item.product_id}`);
      return;
    }

    navigate("/products");
  };

  const handleContactSupport = () => {
    window.location.href = "/#contact";
  };

  const handleTrackPackage = () => {
    const section = document.getElementById("shipment-status-card");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const canCancel = ["pending", "processing"].includes(normalizedStatus);
  const trackingNumber = order.tracking_number || order.tracking_code || "";

  const handleDownloadInvoice = () => {
    window.print();
  };

  return (
    <div className="track-page">
      <Navbar />

      {/* Hero */}
      <div className="track-hero">
        <div className="container">
          <div className="track-hero-label">TechPulse · Order Tracking</div>
          <h1>Order #{order.id}</h1>
          <p className="mb-0 mt-1" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
            {formatOrderDate(order.created_at)}
          </p>
        </div>
      </div>

      <div className="track-main">
        <div className="container track-order-shell" style={{ maxWidth: 1080 }}>
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill mb-4"
            onClick={() => navigate("/orders")}
          >
            ← Back to Orders
          </button>

          <div className="tp-detail-section">
            <div className="tp-detail-card track-order-header-card">
              <div className="track-order-header-card__primary">
                <div>
                  <div className="track-order-overline">Order Detail</div>
                  <div className="track-order-title-row">
                    <h2 className="track-order-title mb-0">Order #{order.id}</h2>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <div className="track-order-inline-meta">
                  <div>
                    <div className="tp-detail-label">Placed On</div>
                    <div className="tp-detail-value">{formatOrderDate(order.created_at)}</div>
                  </div>
                  <div>
                    <div className="tp-detail-label">Total Amount</div>
                    <div className="track-order-total">{formatCurrency(order.total_amount)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tp-detail-section">
            <div className="tp-detail-card track-shipment-hero" id="shipment-status-card">
              <div className="track-shipment-hero__top">
                <div>
                  <div className="tp-detail-card__title mb-2">Shipment Status</div>
                  <div className="track-shipment-hero__headline">Track your shipment progress</div>
                  <div className="track-shipment-hero__subtext">
                    Stay updated with the latest delivery milestone for this order.
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill px-4"
                  onClick={handleTrackPackage}
                  disabled={["pending", "processing", "cancelled"].includes(normalizedStatus)}
                >
                  Track Package
                </button>
              </div>

              <div className="track-shipment-hero__meta">
                <div className="track-shipment-hero__meta-card">
                  <div className="tp-detail-label">Current Status</div>
                  <div className="tp-detail-value"><OrderStatusBadge status={order.status} /></div>
                </div>
                <div className="track-shipment-hero__meta-card">
                  <div className="tp-detail-label">Estimated Delivery</div>
                  <div className="tp-detail-value">{getEstimatedDeliveryLabel(order.status)}</div>
                </div>
                {trackingNumber && (
                  <div className="track-shipment-hero__meta-card">
                    <div className="tp-detail-label">Tracking Number</div>
                    <div className="tp-detail-value tp-detail-value--wrap">{trackingNumber}</div>
                  </div>
                )}
                <div className="track-shipment-hero__meta-card">
                  <div className="tp-detail-label">Payment Status</div>
                  <div className="tp-detail-value">
                    <PaymentBadge
                      status={order.payment?.status || order.payment_status}
                      method={order.payment?.payment_method || order.payment_method}
                    />
                  </div>
                </div>
              </div>

              <div className="track-shipment-hero__timeline">
                <ShippingTimeline status={order.status} />
              </div>
            </div>
          </div>

          <div className="tp-detail-section">
            <div className="tp-detail-card tp-products-card track-products-card">
              <div className="tp-detail-card__title">Purchased Products</div>
              <div className="tp-products-card__cols">
                <span>Product</span>
                <span>Quantity</span>
                <span>Unit Price</span>
                <span className="text-end">Subtotal</span>
              </div>
              {(order.items || []).map((item) => (
                <ProductRow
                  key={item.id}
                  item={item}
                  onOpen={() => handleProductNavigation(item)}
                />
              ))}
            </div>
          </div>

          <div className="tp-detail-section row g-3 track-bottom-grid">
            <div className="col-lg-6">
              <ShippingCard order={order} />
            </div>
            <div className="col-lg-6">
              <PaymentCard payment={order.payment} />
            </div>
          </div>

          <div className="tp-detail-section row g-3">
            <div className="col-lg-6 ms-lg-auto">
              <OrderSummaryCard order={order} />
            </div>
          </div>

          <div className="tp-detail-section">
            <div className="tp-detail-card track-footer-actions-card">
              <div className="track-footer-actions-layout">
                <div className="track-footer-help">
                  <div className="track-footer-help__title">Need help with your order?</div>
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none px-0 track-footer-actions__text"
                    onClick={handleContactSupport}
                  >
                    <span aria-hidden="true">⌁</span>
                    <span>Contact Support</span>
                  </button>
                </div>

                <div className="track-footer-actions">
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4 track-footer-actions__btn"
                    onClick={() => handleProductNavigation()}
                  >
                    Buy Again
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4 track-footer-actions__btn"
                    onClick={handleDownloadInvoice}
                  >
                    Download Invoice
                  </button>
                  {canCancel && (
                    <button
                      type="button"
                      className="btn btn-outline-danger rounded-pill px-4 track-footer-actions__btn"
                      onClick={handleCancel}
                      disabled={cancelling}
                    >
                      {cancelling ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none px-0 track-footer-actions__text track-footer-actions__text--mobile"
                    onClick={handleContactSupport}
                  >
                    <span aria-hidden="true">⌁</span>
                    <span>Contact Support</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
