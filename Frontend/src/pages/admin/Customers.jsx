import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  getAllCustomers,
  deleteCustomer,
  updateCustomer,
} from "../../services/customerService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editCustomer, setEditCustomer] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "user",
    is_verified: 0,
  });

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Customer?",
      text: "You won't be able to recover this customer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCustomer(id);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Customer deleted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchCustomers();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete customer.",
      });
    }
  };

  const handleEditClick = (customer) => {
    setEditCustomer(customer);
    setFormData({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      role: customer.role || "customer",
      is_verified: customer.is_verified || 0,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCustomer(editCustomer.id, formData);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Customer updated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      setEditCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update customer.",
      });
    }
  };

  useEffect(() => {
    const loadCustomers = async () => {
      await fetchCustomers();
    };

    void loadCustomers();
  }, []);

  useEffect(() => {
    const resetPage = () => {
      setCurrentPage(1);
    };

    void resetPage();
  }, [search]);

  const filteredCustomers = customers.filter((customer) => {
    const keyword = search.toLowerCase();

    return (
      (customer.first_name || "").toLowerCase().includes(keyword) ||
      (customer.last_name || "").toLowerCase().includes(keyword) ||
      (customer.email || "").toLowerCase().includes(keyword)
    );
  });

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer,
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const totalCustomers = customers.length;
  const verifiedCustomers = customers.filter(
    (customer) => customer.is_verified,
  ).length;
  const unverifiedCustomers = totalCustomers - verifiedCustomers;
  const newCustomersThisMonth = customers.filter((customer) => {
    const created = new Date(customer.created_at);
    const now = new Date();
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {/* <h2 className="fw-bold mb-1">Customers</h2> */}
          <p className="text-muted mb-0">Manage registered customers</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Customers</h6>
              <h3 className="fw-bold mb-0">{totalCustomers}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Verified Customers</h6>
              <h3 className="fw-bold mb-0">{verifiedCustomers}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Unverified Customers</h6>
              <h3 className="fw-bold mb-0">{unverifiedCustomers}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">New Customers This Month</h6>
              <h3 className="fw-bold mb-0">{newCustomersThisMonth}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Joined Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="fw-semibold">
                          {customer.full_name ||
                            `${customer.first_name || ""} ${customer.last_name || ""}`.trim()}
                        </div>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.role}</td>
                      <td>
                        <span
                          className={`badge ${customer.is_verified ? "bg-success" : "bg-secondary"}`}
                        >
                          {customer.is_verified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td>
                        {customer.created_at
                          ? new Date(customer.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="text-center">
                        <Link
                          to={`/admin/customers/${customer.id}`}
                          className="btn btn-sm btn-outline-primary me-2"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>

                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          title="Edit"
                          onClick={() => handleEditClick(customer)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center p-3">
              <small className="text-muted">
                Showing {currentCustomers.length} of {filteredCustomers.length}{" "}
                customers
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
                      className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
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
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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

      {editCustomer && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Customer</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditCustomer(null)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Verified</label>
                    <select
                      className="form-select"
                      value={formData.is_verified}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_verified: Number(e.target.value),
                        })
                      }
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setEditCustomer(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
