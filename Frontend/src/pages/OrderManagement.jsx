import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/OrderManagement.css";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLOR = {
  pending: "#856404",
  processing: "#004085",
  shipped: "#0c5460",
  delivered: "#155724",
  cancelled: "#721c24",
};

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null); // orderId being updated
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(
    (o) =>
      String(o.id).includes(search) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.last_name?.toLowerCase().includes(search.toLowerCase()),
  );

  // Stats
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total_amount), 0);

  const countByStatus = (st) => orders.filter((o) => o.status === st).length;

  if (loading) {
    return (
      <div className="mgmt-page">
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
      <div className="mgmt-page">
        <Navbar />
        <div className="mgmt-main">
          <div className="container">
            <div className="alert alert-danger rounded-3">{error}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mgmt-page">
      <Navbar />

      {/* Hero */}
      <div className="mgmt-hero">
        <div className="container">
          <div className="mgmt-hero-label">TechPulse · Admin</div>
          <h1>Order Management</h1>
          <p className="mb-0 mt-1" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem" }}>
            {orders.length} total orders
          </p>
        </div>
      </div>

      <div className="mgmt-main">
        <div className="container-xl">
          {/* Stats */}
          <div className="row g-3 mb-4">
            {[
              { label: "Total Orders", value: orders.length, color: "#0f172a" },
              { label: "Revenue", value: `฿${totalRevenue.toLocaleString()}`, color: "#2563eb" },
              { label: "Pending", value: countByStatus("pending"), color: "#854d0e" },
              { label: "Processing", value: countByStatus("processing"), color: "#1e40af" },
              { label: "Delivered", value: countByStatus("delivered"), color: "#166534" },
            ].map((stat) => (
              <div className="col-6 col-sm-4 col-md" key={stat.label}>
                <div className="mgmt-stat-card">
                  <div className="stat-num" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="mb-3">
            <input
              className="form-control rounded-pill"
              style={{ maxWidth: 380, paddingLeft: "1.25rem" }}
              placeholder="Search by ID, name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="mgmt-table-card">
            <div className="table-responsive">
              <table className="table mgmt-table mb-0">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>City</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-4">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>
                          <div className="customer-name">
                            {order.first_name} {order.last_name}
                          </div>
                          <div className="customer-email">{order.email}</div>
                        </td>
                        <td>{order.item_count}</td>
                        <td className="amount-col">
                          ฿{Number(order.total_amount).toLocaleString()}
                        </td>
                        <td>{order.shipping_city}</td>
                        <td>{new Date(order.created_at).toLocaleDateString("th-TH")}</td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status}
                            style={{ color: STATUS_COLOR[order.status] }}
                            disabled={updating === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                          {updating === order.id && (
                            <span className="spinner-border spinner-border-sm ms-2 text-primary" />
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm rounded-pill"
                            onClick={() => navigate(`/track/${order.id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderManagement;
