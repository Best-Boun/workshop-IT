import "../css/Auth.css";

const AuthLayout = ({ title, description, children }) => {
  return (
    <div className="auth-layout">
      <div className="container py-5">
        <div className="row justify-content-center gx-5 align-items-center">
          <div className="col-lg-5 d-none d-lg-flex">
            <div className="auth-panel rounded-4 shadow-xl p-5 text-white">
              <div className="auth-panel-title mb-3">TechPulse Access</div>
              <h2 className="fw-bold mb-3">
                Secure, fast, and premium shopping.
              </h2>
              <p className="text-white-75 mb-4">
                Sign in or register to access your dashboard, track orders, and
                save your favorite build components.
              </p>
              <div className="auth-feature-list">
                <div className="d-flex align-items-start mb-3">
                  <div className="feature-dot bg-white text-primary me-3">
                    ✔
                  </div>
                  <div>
                    <h6 className="mb-1">Easy account access</h6>
                    <p className="text-white-75 mb-0">
                      One secure profile for orders, warranty, and support.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <div className="feature-dot bg-white text-primary me-3">
                    ✔
                  </div>
                  <div>
                    <h6 className="mb-1">Premium support</h6>
                    <p className="text-white-75 mb-0">
                      Get the best deals with quick access to support and
                      shipping tools.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="feature-dot bg-white text-primary me-3">
                    ✔
                  </div>
                  <div>
                    <h6 className="mb-1">Prepared for backend</h6>
                    <p className="text-white-75 mb-0">
                      This layout is designed to connect with auth APIs later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="auth-card card border-0 rounded-4 shadow-sm p-4 p-lg-5">
              <div className="mb-4">
                <a href="#" className="brand-link fw-bold text-primary fs-4">
                  TechPulse
                </a>
                <h1 className="h3 fw-bold mt-3 mb-2">{title}</h1>
                <p className="text-muted mb-0">{description}</p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
