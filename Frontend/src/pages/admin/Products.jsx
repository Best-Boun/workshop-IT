import { useEffect, useState } from "react";
import {
  getAllProducts,
  getCategories,
  deleteProduct,
  toggleProductStatus,
} from "../../services/productService";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { canAccessPage } from "../../components/PrivateRoute";

const Products = () => {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
  );
  const canManageProducts = canAccessPage(user, "products", "manage");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!canManageProducts) return;

    const result = await Swal.fire({
      title: "Delete Product?",
      text: "You won't be able to recover this product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Product deleted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchProducts();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete product.",
      });
    }
  };

  const handleToggleStatus = async (product) => {
    if (!canManageProducts) return;

    const newStatus = product.status === "active" ? "inactive" : "active";

    const result = await Swal.fire({
      title: "Change Product Status?",
      html: `
      <b>${product.name}</b><br/><br/>
      Change status to <b>${newStatus}</b> ?
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await toggleProductStatus(product.id, newStatus);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product status updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchProducts();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update product status.",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, brand, status]);

  useEffect(() => {
    setBrand("");
  }, [category]);

  const brands = [
    ...new Set(
      products
        .filter((p) => category === "" || p.category === category)
        .map((p) => p.brand),
    ),
  ].sort();

  const filteredProducts = products.filter((product) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      product.name.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword);

    const matchCategory = category === "" || product.category === category;

    const matchBrand = brand === "" || product.brand === brand;

    const matchStatus = status === "" || product.status === status;

    return matchSearch && matchCategory && matchBrand && matchStatus;
  }); // <-- ปิด filter ตรงนี้

  const indexOfLastProduct = currentPage * itemsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {/* <h2 className="fw-bold mb-1">Products</h2> */}
          <p className="text-muted mb-0">Manage your products</p>
        </div>

        {canManageProducts ? (
          <Link to="/admin/products/add" className="btn btn-primary">
            + Add Product
          </Link>
        ) : (
          <button type="button" className="btn btn-secondary" disabled>
            + Add Product
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-lg-3">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2">
              <select
                className="form-select"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">All Brands</option>

                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2">
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.id}>
                      {/* Image */}
                      <td>
                        {product.image ? (
                          <img
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.name}
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

                      {/* Product */}
                      <td>
                        <div className="fw-semibold">{product.name}</div>
                        <small className="text-muted">{product.brand}</small>
                      </td>

                      {/* Category */}
                      <td>{product.category}</td>

                      {/* Price */}
                      <td className="fw-semibold">
                        ฿{Number(product.price).toLocaleString()}
                      </td>

                      {/* Stock */}
                      <td>
                        <span
                          className={`fw-semibold ${
                            product.stock > 20
                              ? "text-success"
                              : product.stock > 10
                                ? "text-warning"
                                : "text-danger"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            product.status === "active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                          role={canManageProducts ? "button" : undefined}
                          style={{
                            cursor: canManageProducts
                              ? "pointer"
                              : "not-allowed",
                            opacity: canManageProducts ? 1 : 0.75,
                          }}
                          onClick={
                            canManageProducts
                              ? () => handleToggleStatus(product)
                              : undefined
                          }
                        >
                          {product.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="text-center">
                        {canManageProducts ? (
                          <Link
                            to={`/admin/products/edit/${product.id}`}
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
                          disabled={!canManageProducts}
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center p-3">
              <small className="text-muted">
                Showing {currentProducts.length} of {filteredProducts.length}{" "}
                products
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

export default Products;
