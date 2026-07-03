import "./BestSellers.css";

const bestSellers = [
  {
    title: "Stellar GPU",
    price: "$699",
    tag: "Best seller",
  },
  {
    title: "VoltCore PSU",
    price: "$129",
    tag: "High reliability",
  },
  {
    title: "AeroFlow Case",
    price: "$99",
    tag: "Premium airflow",
  },
];

const BestSellers = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5 mb-4 mb-lg-0">
            <p className="text-uppercase text-primary small fw-semibold mb-2">
              Best sellers
            </p>
            <h2 className="fw-bold">Customers keep choosing these favorites</h2>
            <p className="text-muted">
              Discover trusted components that combine performance, value, and
              long-term durability.
            </p>
          </div>
          <div className="col-lg-7">
            <div className="row g-3">
              {bestSellers.map((item) => (
                <div key={item.title} className="col-sm-6">
                  <div className="card best-seller-card border-0 rounded-4 shadow-sm h-100 p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h5 className="mb-1">{item.title}</h5>
                        <p className="text-muted mb-0">{item.tag}</p>
                      </div>
                      <span className="fw-bold text-primary">{item.price}</span>
                    </div>
                    <p className="text-muted mb-0">
                      Perfect for builds that need consistent performance and
                      durability.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
