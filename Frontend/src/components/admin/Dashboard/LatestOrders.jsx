const LatestOrders = () => {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="fw-bold mb-3">Latest Orders</h5>

        <div className="dashboard-placeholder placeholder-large">
          <div className="text-center">
            <i className="bi bi-cart-check placeholder-icon"></i>

            <p className="placeholder-text">Latest Orders will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestOrders;
