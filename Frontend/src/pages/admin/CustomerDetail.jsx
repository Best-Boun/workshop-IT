import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCustomer } from "../../services/customerService";

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const data = await getCustomer(id);
        setCustomer(data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    void loadCustomer();
  }, [id]);

  if (!customer) {
    return <div className="container-fluid">Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Customer Detail</h2>
          <p className="text-muted mb-0">
            View customer profile and order history
          </p>
        </div>
        <Link to="/admin/customers" className="btn btn-outline-secondary">
          Back to Customers
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Customer Information</h5>
              <p className="mb-2">
                <strong>Full Name:</strong> {customer.full_name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {customer.email}
              </p>
              <p className="mb-2">
                <strong>Role:</strong> {customer.role}
              </p>
              <p className="mb-2">
                <strong>Verified:</strong>{" "}
                <span
                  className={`badge ${customer.is_verified ? "bg-success" : "bg-secondary"}`}
                >
                  {customer.is_verified ? "Verified" : "Unverified"}
                </span>
              </p>
              <p className="mb-2">
                <strong>Joined Date:</strong>{" "}
                {customer.created_at
                  ? new Date(customer.created_at).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted">Total Orders</h6>
                  <h3 className="fw-bold mb-0">{customer.total_orders || 0}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted">Total Spending</h6>
                  <h3 className="fw-bold mb-0">
                    ฿{Number(customer.total_spending || 0).toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted">Latest Order</h6>
                  <h3 className="fw-bold mb-0">
                    {customer.latest_order_date
                      ? new Date(
                          customer.latest_order_date,
                        ).toLocaleDateString()
                      : "-"}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Recent Orders</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.recent_orders &&
                    customer.recent_orders.length > 0 ? (
                      customer.recent_orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            <span
                              className={`badge ${order.status === "Completed" ? "bg-success" : order.status === "Cancelled" ? "bg-danger" : order.status === "Shipping" ? "bg-primary" : order.status === "Paid" ? "bg-info" : "bg-secondary"}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>฿{Number(order.total_price).toLocaleString()}</td>
                          <td>
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
