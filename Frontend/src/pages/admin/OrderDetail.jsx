import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getOrder, updateOrderStatus } from "../../services/orderService";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrder(id);
        setOrder(data);
        setStatus(data.status || "Pending");
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    void loadOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      const response = await updateOrderStatus(id, status);

      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: response.message || "Order status updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/admin/orders");
    } catch (error) {
      console.error("Update status error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update order status.",
      });
    }
  };

  if (!order) {
    return <div className="container-fluid">Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Order Detail</h2>
          <p className="text-muted mb-0">View and manage order information</p>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <p className="mb-1 text-muted">Order ID</p>
              <h5 className="fw-bold">#{order.id}</h5>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted">Customer Name</p>
              <h5 className="fw-bold">{order.customer_name || "-"}</h5>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted">Customer Email</p>
              <h5 className="fw-bold">{order.customer_email || "-"}</h5>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted">Shipping Address</p>
              <h5 className="fw-bold">{order.shipping_address || "-"}</h5>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted">Shipping City</p>
              <h5 className="fw-bold">{order.shipping_city || "-"}</h5>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted">Postal Code</p>
              <h5 className="fw-bold">{order.shipping_postal_code || "-"}</h5>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted">Country</p>
              <h5 className="fw-bold">{order.shipping_country || "-"}</h5>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted">Created Date</p>
              <h5 className="fw-bold">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "-"}
              </h5>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted">Order Status</p>
              <h5 className="fw-bold">{order.status}</h5>
            </div>
            <div className="col-md-6">
              <p className="mb-1 text-muted">Total Price</p>
              <h5 className="fw-bold">
                ฿{Number(order.total_price).toLocaleString()}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-8">
              <label className="form-label">Update Order Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100"
                onClick={handleStatusUpdate}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Ordered Products</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={`${item.product_id || index}-${index}`}>
                      <td>
                        {item.product_image ? (
                          <img
                            src={`http://localhost:5000/uploads/${item.product_image}`}
                            alt={item.product_name}
                            width="60"
                            height="60"
                            className="rounded border"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="border rounded d-flex align-items-center justify-content-center text-muted"
                            style={{
                              width: "60px",
                              height: "60px",
                              fontSize: "12px",
                            }}
                          >
                            No Image
                          </div>
                        )}
                      </td>
                      <td>{item.product_name || "-"}</td>
                      <td>{item.quantity}</td>
                      <td>฿{Number(item.price).toLocaleString()}</td>
                      <td>฿{Number(item.subtotal).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
