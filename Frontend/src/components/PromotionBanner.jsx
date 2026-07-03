import "./PromotionBanner.css";

const PromotionBanner = () => {
  return (
    <section className="promotion-banner py-5 position-relative overflow-hidden">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-lg-7">
            <p className="text-uppercase text-white mb-2 small fw-semibold">
              Limited time offer
            </p>
            <h2 className="display-6 fw-bold text-white mb-3">
              Save up to 20% on the latest GPU and CPU bundles
            </h2>
            <p className="text-white-75 mb-4">
              Shop the premium hardware sale and upgrade your rig with fast
              shipping and expert service.
            </p>
            <a
              className="btn btn-light btn-lg text-primary rounded-pill"
              href="#products"
            >
              Explore deals
            </a>
          </div>
          <div className="col-lg-4 d-none d-lg-block text-end">
            <div className="promotion-pill bg-white bg-opacity-15 text-white rounded-pill px-4 py-3 d-inline-flex align-items-center shadow-sm">
              <span className="fs-3 fw-bold me-3">20%</span>
              <span>Off selected items</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
