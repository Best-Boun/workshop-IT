import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./AdminDashboard.css";

const sections = [
  { path: "overview", label: "Overview" },
  { path: "sales", label: "Sales Analytics" },
  { path: "orders", label: "Order Management" },
  { path: "top-products", label: "Top Products" },
  { path: "inventory", label: "Inventory" },
  { path: "customers", label: "Customer Analytics" },
  { path: "payments", label: "Payment" },
  { path: "reports", label: "Reports & Notifications" },
  { path: "admin-management", label: "Admin Management" },
];

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-page">
      <Navbar />
      <div className="container-fluid py-4">
        <header className="admin-dashboard-topbar rounded shadow-sm mb-4 bg-white">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 p-4">
            <div className="d-flex align-items-start gap-3">
              <div className="admin-topbar-icon rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
                <i className="bi bi-speedometer2 fs-4" />
              </div>
              <div>
                <h2 className="mb-1">TechPulse Super Admin</h2>
                <p className="text-muted mb-0">
                  แดชบอร์ดการบริหารร้านค้า ดูภาพรวมยอดขาย สต็อก
                  และคำสั่งซื้อทั้งหมดได้ในที่เดียว
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              <button className="btn btn-outline-primary btn-sm">
                <i className="bi bi-bell-fill me-1" /> Notifications
                <span className="badge bg-danger ms-2">3</span>
              </button>
              <button className="btn btn-primary btn-sm">
                <i className="bi bi-file-earmark-arrow-down me-1" /> Download
                Report
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-gear-fill" /> Settings
              </button>
            </div>
          </div>
        </header>

        <div className="admin-dashboard-shell d-flex flex-column flex-xl-row gap-4">
          <aside className="admin-dashboard-sidebar bg-white rounded shadow-sm p-4">
            <div className="mb-4">
              <h5 className="mb-1">เมนูหลัก</h5>
              <p className="text-muted mb-0">เลือกดูข้อมูลจากแต่ละระบบ</p>
            </div>

            <nav className="nav flex-column admin-dashboard-nav">
              {sections.map((section) => (
                <NavLink
                  key={section.path}
                  to={section.path}
                  className={({ isActive }) =>
                    `nav-link mb-2 rounded py-2 px-3 ${isActive ? "active" : "text-secondary"}`
                  }
                >
                  <span className="nav-link-icon me-2">
                    <i
                      className={`bi bi-${section.path === "overview" ? "grid-3x3-gap" : section.path === "sales" ? "graph-up" : section.path === "orders" ? "basket3" : section.path === "top-products" ? "star-fill" : section.path === "inventory" ? "inbox-fill" : section.path === "customers" ? "people-fill" : section.path === "payments" ? "receipt-cutoff" : section.path === "admin-management" ? "person-gear" : "bell-fill"}`}
                    />
                  </span>
                  {section.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <section className="admin-dashboard-content flex-fill bg-white rounded shadow-sm p-4">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
