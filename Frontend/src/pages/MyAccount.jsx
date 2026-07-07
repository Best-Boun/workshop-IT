import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sectionCardStyle = {
  border: "1px solid #e2e8f0",
};

const sectionTitleStyle = {
  fontSize: "0.78rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#64748b",
  fontWeight: 700,
};

const linkStyle = {
  textDecoration: "none",
  color: "#0f172a",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.75rem 0.85rem",
  borderBottom: "1px solid #eef2f7",
  fontWeight: 600,
  borderRadius: "0.6rem",
};

const activeLinkStyle = {
  background: "#eff6ff",
  color: "#1d4ed8",
};

const MyAccount = () => {
  const menuItems = [
    { to: "personal-information", label: "Personal Information", icon: "👤" },
    { to: "addresses", label: "My Addresses", icon: "📍" },
    { to: "payment-methods", label: "Payment Methods", icon: "💳" },
    { to: "login-security", label: "Login & Security", icon: "🔒" },
  ];

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
            TechPulse · Account
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            My Account
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", marginBottom: 0 }}>
            Manage your account settings in one place
          </p>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: 1120 }}>
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-4">
            <div className="card border-0 rounded-4 shadow-sm sticky-lg-top" style={{ ...sectionCardStyle, top: 90 }}>
              <div className="card-body p-4">
                <div style={sectionTitleStyle}>Account Menu</div>

                <div className="d-grid gap-2 mt-2">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end
                      style={({ isActive }) => ({
                        ...linkStyle,
                        borderBottom: "none",
                        ...(isActive ? activeLinkStyle : {}),
                      })}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyAccount;
