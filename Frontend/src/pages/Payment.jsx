import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Payment.css";

const METHODS = [
  { key: "credit_card", label: "💳 Credit / Debit Card" },
  { key: "promptpay", label: "🟩 PromptPay" },
  { key: "bank_transfer", label: "🏦 Bank Transfer" },
];

const Payment = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const total = location.state?.total || 0;

  const [method, setMethod] = useState("credit_card");
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, transactionId, message }

  const formatCardNumber = (val) => {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const payload = {
        order_id: Number(orderId),
        payment_method: method,
        ...(method === "credit_card" && { card_number: card.number }),
      };

      const res = await api.post("/payments/process", payload);

      setResult({
        success: res.data.success,
        transactionId: res.data.data?.transactionId,
        message: res.data.message,
      });
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || "Payment error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Result Screen ───
  if (result) {
    return (
      <div className="payment-page">
        <Navbar />
        <div className="payment-hero">
          <div className="container">
            <div className="payment-hero-label">TechPulse · Payment</div>
            <h1>Payment {result.success ? "Confirmed" : "Failed"}</h1>
          </div>
        </div>
        <div className="payment-main">
          <div className="payment-card result-card">
            {result.success ? (
              <>
                <div className="result-icon">✅</div>
                <h4 className="fw-bold text-success">Payment Successful!</h4>
                <p className="text-muted mb-1">
                  Transaction ID: <strong>{result.transactionId}</strong>
                </p>
                <p className="text-muted mb-4">Order #{orderId} is confirmed</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-primary rounded-pill px-4"
                    onClick={() => navigate(`/track/${orderId}`)}
                  >
                    Track Order
                  </button>
                  <button
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => navigate("/orders")}
                  >
                    My Orders
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="result-icon">❌</div>
                <h4 className="fw-bold text-danger">Payment Failed</h4>
                <p className="text-muted mb-4">{result.message}</p>
                <button
                  className="btn btn-warning rounded-pill px-4"
                  onClick={() => setResult(null)}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Payment Form ───
  return (
    <div className="payment-page">
      <Navbar />

      {/* Hero */}
      <div className="payment-hero">
        <div className="container">
          <div className="payment-hero-label">TechPulse · Shopping</div>
          <h1>Payment</h1>
          <p className="mb-0 mt-1" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
            Order #{orderId}
          </p>
        </div>
      </div>

      <div className="payment-main">
        <div className="payment-card">
          {/* Amount */}
          <div className="amount-badge">฿{Number(total).toLocaleString()}</div>

          {/* Method selector */}
          <p className="text-uppercase text-primary small fw-semibold mb-3">
            Payment Method
          </p>
          {METHODS.map((m) => (
            <div
              key={m.key}
              className={`payment-method-btn ${method === m.key ? "active" : ""}`}
              onClick={() => setMethod(m.key)}
            >
              {m.label}
            </div>
          ))}

          <div className="mt-4">
            {/* Card form */}
            {method === "credit_card" && (
              <>
                <div className="card-visual">
                  <div className="card-chip" />
                  <div className="card-number-display">
                    {card.number || "•••• •••• •••• ••••"}
                  </div>
                  <div className="card-info-row">
                    <span>{card.name || "CARDHOLDER NAME"}</span>
                    <span>{card.expiry || "MM/YY"}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">
                    Card Number
                  </label>
                  <input
                    className="form-control rounded-3"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    maxLength={19}
                    onChange={(e) =>
                      setCard({ ...card, number: formatCardNumber(e.target.value) })
                    }
                  />
                  <small className="text-muted">
                    Test decline: <code>4000 0000 0000 0002</code>
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">
                    Cardholder Name
                  </label>
                  <input
                    className="form-control rounded-3"
                    placeholder="John Doe"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold text-dark">
                      Expiry
                    </label>
                    <input
                      className="form-control rounded-3"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={card.expiry}
                      onChange={(e) =>
                        setCard({ ...card, expiry: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold text-dark">
                      CVV
                    </label>
                    <input
                      className="form-control rounded-3"
                      placeholder="•••"
                      type="password"
                      maxLength={4}
                      value={card.cvv}
                      onChange={(e) =>
                        setCard({ ...card, cvv: e.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {method === "promptpay" && (
              <div className="text-center py-3 mb-3">
                <div
                  className="rounded-4 p-4"
                  style={{ background: "#f0fdf4", border: "2px solid #bbf7d0" }}
                >
                  <div style={{ fontSize: "3rem" }}>🟩</div>
                  <p className="fw-bold mt-2 mb-1">PromptPay QR Code</p>
                  <p className="text-muted small">
                    Scan QR to complete payment (Simulation)
                  </p>
                </div>
              </div>
            )}

            {method === "bank_transfer" && (
              <div className="alert alert-info rounded-3 mb-3">
                <strong>Bank Transfer Details (Simulation)</strong>
                <br />
                Bank: Kasikorn Bank (KBank)
                <br />
                Account: 123-4-56789-0
                <br />
                Name: TechPulse Co., Ltd.
              </div>
            )}
          </div>

          <button
            className="btn btn-primary rounded-pill w-100 py-2 fw-semibold"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Processing...
              </>
            ) : (
              `Pay ฿${Number(total).toLocaleString()} →`
            )}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;
