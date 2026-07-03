import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const STATUS_OPTIONS = ["pending","processing","shipped","delivered","cancelled"];
const STATUS_COLOR = { pending:"#854d0e", processing:"#1e40af", shipped:"#164e63", delivered:"#166534", cancelled:"#991b1b" };

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/orders")
      .then((res) => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) =>
    String(o.id).includes(search) ||
    o.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.first_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>Order Management</h3>
          <p className="text-muted">ติดตามสถานะคำสั่งซื้อทั้งหมด</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: "New Orders", value: orders.filter(o=>o.status==="pending").length, badge: "pending" },
          { label: "In Delivery", value: orders.filter(o=>o.status==="shipped").length, badge: "shipped" },
          { label: "Delivered", value: orders.filter(o=>o.status==="delivered").length, badge: "delivered" },
          { label: "Cancelled", value: orders.filter(o=>o.status==="cancelled").length, badge: "cancelled" },
        ].map((item) => (
          <div key={item.label} className="col-12 col-sm-6 col-lg-3">
            <div className="admin-summary-card p-4 rounded shadow-sm h-100">
              <div className="text-uppercase text-secondary mb-2">{item.label}</div>
              <div className="display-6 fw-bold">{loading ? "…" : item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0">รายการคำสั่งซื้อล่าสุด</h5>
          <input
            className="form-control form-control-sm rounded-pill"
            style={{ maxWidth: 280 }}
            placeholder="Search by ID, name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="d-flex justify-content-center py-4"><div className="spinner-border text-primary"/></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead><tr><th>#</th><th>Customer</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted py-3">No orders found</td></tr>
                ) : filtered.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>
                      <div className="fw-semibold">{order.first_name} {order.last_name}</div>
                      <div className="small text-muted">{order.email}</div>
                    </td>
                    <td className="fw-bold text-primary">฿{Number(order.total_amount).toLocaleString()}</td>
                    <td className="small text-muted">{new Date(order.created_at).toLocaleDateString("th-TH")}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        style={{ maxWidth: 130, color: STATUS_COLOR[order.status], fontWeight: 600 }}
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => navigate(`/track/${order.id}`)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagementPage;
