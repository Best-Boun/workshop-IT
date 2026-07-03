import "./Categories.css";

const categories = [
  "CPU",
  "GPU",
  "RAM",
  "SSD",
  "Mainboard",
  "PSU",
  "Monitor",
  "Accessories",
];

const Categories = () => {
  return (
    <section className="py-5" id="products">
      <div className="container">
        <div className="mb-4 text-center">
          <p className="text-uppercase text-primary mb-2 small fw-semibold">
            Shop by category
          </p>
          <h2 className="fw-bold">Browse hardware categories</h2>
        </div>
        <div className="row g-3">
          {categories.map((category) => (
            <div key={category} className="col-6 col-md-4 col-xl-3">
              <div className="card category-card border-0 rounded-4 shadow-sm h-100 p-4 text-center">
                <div className="mb-3 mx-auto d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 category-icon">
                  <span className="fs-4 text-primary">{category[0]}</span>
                </div>
                <h5 className="mb-0">{category}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
