import { useEffect, useState } from "react";
import { getAllOrders, deleteOrder } from "../../services/orderService";
import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Order?",
      text: "You won't be able to recover this order.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteOrder(id);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Order deleted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchOrders();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete order.",
      });
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
    };

    void loadOrders();
  }, []);

  useEffect(() => {
    const resetPage = () => {
      setCurrentPage(1);
    };

    void resetPage();
  }, [search, statusFilter]);

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      String(order.id).includes(keyword) ||
      (order.customer_name || "").toLowerCase().includes(keyword);
    const matchesStatus = statusFilter === "" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {/* <h2 className="fw-bold mb-1">Orders</h2> */}
          <p className="text-muted mb-0">Manage customer orders</p>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search by order ID or customer name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-lg-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Shipping">Shipping</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer_name || "-"}</td>
                      <td className="fw-semibold">
                        ฿{Number(order.total_price).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === "Completed"
                              ? "bg-success"
                              : order.status === "Cancelled"
                                ? "bg-danger"
                                : order.status === "Shipping"
                                  ? "bg-primary"
                                  : order.status === "Paid"
                                    ? "bg-info"
                                    : "bg-secondary"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="text-center">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="btn btn-sm btn-outline-primary me-2"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDelete(order.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center p-3">
              <small className="text-muted">
                Showing {currentOrders.length} of {filteredOrders.length} orders
              </small>

              <nav>
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
