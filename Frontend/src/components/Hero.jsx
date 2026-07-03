import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero-section text-white py-5 position-relative overflow-hidden">
      <div className="container">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6">
            <div className="hero-label mb-4">Best deals for custom builds</div>
            <h1 className="display-5 fw-bold mb-4">
              Build premium performance with the latest computer hardware.
            </h1>
            <p className="lead text-white-75 mb-4">
              Shop curated components for gaming, workstations, and creative
              rigs with fast delivery and trusted support.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3">
              <a
                className="btn btn-light btn-lg text-primary rounded-pill"
                href="#products"
              >
                Shop Now
              </a>
              <a
                className="btn btn-outline-light btn-lg rounded-pill"
                href="#about"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-card p-4 rounded-5 shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="badge bg-primary bg-opacity-15 text-primary px-3 py-2 rounded-pill">
                  New Arrival
                </span>
                <span className="text-white-75">Limited stock</span>
              </div>
              <div className="hero-image mb-4">
                <div className="hero-device" />
              </div>
              <h3 className="h5 text-white fw-bold mb-2">
                NexaRTX 5200 Graphics Card
              </h3>
              <p className="text-white-75 mb-4">
                Extreme ray tracing, advanced cooling, and premium power for
                next-gen performance.
              </p>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-white-75">Starting at</div>
                  <div className="fs-3 fw-bold">$749</div>
                </div>
                <a
                  href="#products"
                  className="btn btn-primary btn-lg rounded-pill"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
