import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero-section text-white py-5 position-relative overflow-hidden">
      <div className="container">
        <div className="row align-items-center gy-5 hero-grid">
          <div className="col-lg-6">
            <div className="hero-label mb-4">Computer Hardware Store</div>
            <h1 className="hero-title fw-bold mb-4">
              Build Your Dream PC
            </h1>
            <p className="hero-subtitle mb-4">
              Gaming PCs, Notebooks and Official Warranty
            </p>
            <div className="hero-cta-group d-flex flex-column flex-sm-row gap-3">
              <a
                className="btn btn-light btn-lg text-primary rounded-pill"
                href="#products"
              >
                Shop Now
              </a>
              <Link
                className="btn btn-outline-light btn-lg rounded-pill"
                to="/products"
              >
                Browse Products
              </Link>
            </div>

            <div className="hero-highlights mt-4">
              <span className="hero-highlight-pill">High-end Gaming Builds</span>
              <span className="hero-highlight-pill">Official Warranty</span>
              <span className="hero-highlight-pill">Trusted Performance</span>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-card p-4 p-lg-5 rounded-5 shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-4 hero-card-top">
                <span className="badge bg-primary bg-opacity-15 text-primary px-3 py-2 rounded-pill">
                  Gaming Ready
                </span>
                <span className="hero-card-note">Official Warranty</span>
              </div>

              <div className="hero-showcase mb-4">
                <div className="hero-orb hero-orb--one" />
                <div className="hero-orb hero-orb--two" />

                <div className="hero-laptop">
                  <div className="hero-laptop-screen">
                    <div className="hero-screen-glow" />
                    <div className="hero-screen-ui hero-screen-ui--small" />
                    <div className="hero-screen-ui hero-screen-ui--wide" />
                    <div className="hero-screen-grid">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className="hero-laptop-base" />
                </div>

                <div className="hero-floating-card hero-floating-card--specs">
                  <span className="hero-floating-label">Performance</span>
                  <strong>RTX + Ryzen</strong>
                </div>

                <div className="hero-floating-card hero-floating-card--warranty">
                  <span className="hero-floating-label">Coverage</span>
                  <strong>Official Warranty</strong>
                </div>
              </div>

              <h3 className="h5 text-white fw-bold mb-2">
                Modern Gaming Computer & Notebook Collection
              </h3>
              <p className="hero-card-copy mb-4">
                Discover premium performance machines built for competitive
                gaming, work, and creative power.
              </p>

              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <div className="hero-price-label">Starting at</div>
                  <div className="fs-3 fw-bold">฿24,900</div>
                </div>
                <Link
                  to="/products"
                  className="btn btn-primary btn-lg rounded-pill"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
