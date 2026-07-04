import "./Dashboard.css";

const cards = [
  {
    title: "Products",
    value: "152",
    change: "+12%",
    icon: "bi-box-seam",
    color: "primary",
  },
  {
    title: "Orders",
    value: "35",
    change: "+8%",
    icon: "bi-cart-check",
    color: "success",
  },
  {
    title: "Customers",
    value: "89",
    change: "+20%",
    icon: "bi-people",
    color: "warning",
  },
  {
    title: "Revenue",
    value: "฿520,000",
    change: "+18%",
    icon: "bi-cash-stack",
    color: "danger",
  },
];

const StatsCards = () => {
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

              <h3>{card.value}</h3>

              <small>{card.change} from last month</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
