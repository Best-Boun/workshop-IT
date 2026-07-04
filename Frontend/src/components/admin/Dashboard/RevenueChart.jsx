const RevenueChart = () => {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Revenue Chart</h5>

          <button className="btn btn-sm btn-outline-primary">This Month</button>
        </div>

        <div className="dashboard-placeholder placeholder-large">
          <div className="text-center">
            <i className="bi bi-bar-chart-line placeholder-icon"></i>

            <p className="placeholder-text">
              Revenue Chart will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
