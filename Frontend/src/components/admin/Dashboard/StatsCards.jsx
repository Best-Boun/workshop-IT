import "./Dashboard.css";

const StatsCards = ({ summary, loading }) => {
  const cards = [
    {
      title: "Products",
      value: summary?.total_products ?? 0,
      icon: "bi-box-seam",
      color: "primary",
      meta: "Inventory overview",
    },
    {
      title: "Orders",
      value: summary?.total_orders ?? 0,
      icon: "bi-cart-check",
      color: "success",
      meta: "All transactions",
    },
    {
      title: "Customers",
      value: summary?.total_customers ?? 0,
      icon: "bi-people",
      color: "warning",
      meta: "Registered users",
    },
    {
      title: "Total Revenue",
      value: `฿${Number(summary?.total_revenue || 0).toLocaleString()}`,
      icon: "bi-cash-stack",
      color: "danger",
      meta: "All completed sales",
    },
  ];

  return (
    <div className="row g-4">
      {cards.map((card) => (
        <div className="col-xl-3 col-md-6" key={card.title}>
          <div className="dashboard-card">
            <div className={`card-icon bg-${card.color}`}>
              <i className={`bi ${card.icon}`}></i>
            </div>

            <div className="card-info">
              <p>{card.title}</p>

              <h3>{loading ? "—" : card.value}</h3>

              <small>{loading ? "Syncing..." : card.meta}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
