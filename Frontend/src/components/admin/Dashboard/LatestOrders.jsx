import { useEffect, useState } from "react";
import { getRecentOrders } from "../../../services/reportService";

const LatestOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getRecentOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error loading recent orders:", error);
      }
    };

    void loadOrders();
  }, []);

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Latest Orders</h5>
          <span className="text-muted small">Most recent 5</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center text-muted py-5">No recent orders</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>

                    <td>{order.customer_name || "Guest"}</td>

                    <td>
                      <span
                        className={`badge ${
                          order.status === "Delivered"
                            ? "bg-success"
                            : order.status === "Cancelled"
                              ? "bg-danger"
                              : order.status === "Shipped"
                                ? "bg-primary"
                                : order.status === "Processing"
                                  ? "bg-warning text-dark"
                                  : "bg-secondary"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>฿{Number(order.total || 0).toLocaleString()}</td>
                    <td className="text-muted small">
                      {new Date(order.created_date).toLocaleString()}
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

export default LatestOrders;
