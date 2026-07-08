import { useEffect, useState } from "react";
import {
  getAllCategories,
  deleteCategory,
} from "../../services/categoryService";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { canAccessPage } from "../../components/PrivateRoute";

const Categories = () => {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
  );
  const canManageCategories = canAccessPage(user, "categories", "manage");

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!canManageCategories) return;

    const result = await Swal.fire({
      title: "Delete Category?",
      text: "You won't be able to recover this category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory(id);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Category deleted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchCategories();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete category.",
      });
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };

    void loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) => {
    const keyword = search.toLowerCase();

    return category.name.toLowerCase().includes(keyword);
  });

  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;

  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory,
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {/* <h2 className="fw-bold mb-1">Categories</h2> */}
          <p className="text-muted mb-0">Manage your categories</p>
        </div>

        {canManageCategories ? (
          <Link to="/admin/categories/add" className="btn btn-primary">
            + Add Category
          </Link>
        ) : (
          <button type="button" className="btn btn-secondary" disabled>
            + Add Category
          </button>
        )}
      </div>

      {/* Search */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-12">
              <input
                type="text"
                className="form-control"
                placeholder="Search category..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Created Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.length > 0 ? (
                  currentCategories.map((category) => (
                    <tr key={category.id}>
                      {/* Image */}
                      <td>
                        {category.image ? (
                          <img
                            src={`http://localhost:5000/uploads/${category.image}`}
                            alt={category.name}
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

                      {/* Name */}
                      <td>
                        <div className="fw-semibold">{category.name}</div>
                      </td>

                      {/* Created Date */}
                      <td>
                        {category.created_at
                          ? new Date(category.created_at).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* Action */}
                      <td className="text-center">
                        {canManageCategories ? (
                          <Link
                            to={`/admin/categories/edit/${category.id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary me-2"
                            title="No manage permission"
                            disabled
                          >
                            <Pencil size={16} />
                          </button>
                        )}

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          disabled={!canManageCategories}
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center p-3">
              <small className="text-muted">
                Showing {currentCategories.length} of{" "}
                {filteredCategories.length} categories
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

export default Categories;
