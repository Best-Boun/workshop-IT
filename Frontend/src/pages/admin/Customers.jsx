import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { getAllCustomers } from "../../services/customerService";
import { canAccessPage } from "../../components/PrivateRoute";

const Customers = () => {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
  );
  const canManageCustomers = canAccessPage(user, "customers", "manage");

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
 

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
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

                      <td>
                        {customer.created_at
                          ? new Date(customer.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="text-center">
                        {canManageCustomers ? (
                          <Link
                            to={`/admin/customers/${customer.id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary me-2"
                            title="No manage permission"
                            disabled
                          >
                            <Eye size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
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
    </div>
  );
};

export default Customers;
