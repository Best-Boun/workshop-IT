const LowStock = () => {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="fw-bold mb-3">Low Stock</h5>

        <div className="dashboard-placeholder placeholder-small">
          <div className="text-center">
            <i className="bi bi-exclamation-triangle placeholder-icon"></i>

            <p className="placeholder-text">Low stock products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStock;
