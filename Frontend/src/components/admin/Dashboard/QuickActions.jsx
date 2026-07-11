import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-body">
        <h5 className="fw-bold mb-3">Quick Actions</h5>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/products")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Manage Products
          </button>

          <button
            className="btn btn-success"
            onClick={() => navigate("/admin/categories")}
          >
            <i className="bi bi-grid me-2"></i>
            Manage Categories
          </button>

          <button
            className="btn btn-warning text-white"
            onClick={() => navigate("/admin/orders")}
          >
            <i className="bi bi-cart-check me-2"></i>
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
