import "./WhyChooseUs.css";

const features = [
  {
    title: "Official Warranty",
    description: "Protected parts with trusted manufacturer coverage.",
  },
  {
    title: "Fast Delivery",
    description: "Quick shipping for urgent upgrades and builds.",
  },
  {
    title: "Secure Payment",
    description: "Encrypted checkout with reliable payment options.",
  },
  {
    title: "24/7 Support",
    description: "Real support whenever you need guidance.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-section py-5 bg-light">
      <div className="container">
        <div className="why-choose-header text-center mb-4 mb-lg-5">
          <p className="text-uppercase text-primary mb-2 small fw-semibold">
            Why choose us
          </p>
          <h2 className="fw-bold">
            Everything your build needs, backed by service
          </h2>
        </div>

        <div className="row g-3 g-lg-4 why-choose-grid">
          {features.map((feature) => (
            <div key={feature.title} className="col-md-6 col-xl-3">
              <div className="card why-choose-card border-0 rounded-4 shadow-sm h-100 p-4 text-center">
                <div className="mb-3 why-choose-icon-wrap">
                  <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3 rounded-pill feature-badge">
                    ✓
                  </span>
                </div>
                <h5 className="fw-semibold mb-3">{feature.title}</h5>
                <p className="text-muted mb-0">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
