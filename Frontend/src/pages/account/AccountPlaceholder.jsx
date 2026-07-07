import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AccountPlaceholder = ({
  title,
  subtitle,
  description,
  primaryActionLabel = "Back to My Account",
  primaryActionTo = "/my-account",
  embedded = false,
}) => {
  const navigate = useNavigate();

  const contentCard = (
    <div className="card border-0 rounded-4 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
      <div className="card-body p-4 p-md-5 text-center">
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🗂️</div>
        <h2 className="h4 fw-bold text-dark mb-2">{title} is coming soon</h2>
        <p className="text-muted mb-4" style={{ maxWidth: 560, margin: "0 auto" }}>
          {description}
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-2">
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => navigate(primaryActionTo)}
          >
            {primaryActionLabel}
          </button>
          <button
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <>
        <div className="mb-3">
          <h2 className="h4 fw-bold mb-1">{title}</h2>
          <p className="text-muted mb-0">Planned for an upcoming release</p>
        </div>
        {contentCard}
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #2563eb 60%, #0ea5e9 100%)",
          padding: "3rem 0 2.5rem",
          color: "#fff",
        }}
      >
        <div className="container">
          <div
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.72)",
              marginBottom: "0.35rem",
            }}
          >
            {subtitle || "TechPulse · My Account"}
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            {title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", marginBottom: 0 }}>
            Planned for an upcoming release
          </p>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: 860 }}>
        {contentCard}
      </div>

      <Footer />
    </div>
  );
};

export default AccountPlaceholder;
