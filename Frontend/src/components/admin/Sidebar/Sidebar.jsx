import { NavLink } from "react-router-dom";
import { canAccessPage } from "../../PrivateRoute";
import "./Sidebar.css";

const Sidebar = () => {
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
  );

  const canView = (pageKey) => canAccessPage(user, pageKey, "view");

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <h4>TechPulse</h4>
        <span>Admin Panel</span>
      </div>

      <nav className="sidebar-menu">
        {canView("dashboard") && (
          <NavLink to="/admin/dashboard" className="sidebar-link">
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </NavLink>
        )}

        {canView("products") && (
          <NavLink to="/admin/products" className="sidebar-link">
            <i className="bi bi-box-seam"></i>
            <span>Products</span>
          </NavLink>
        )}

        {canView("categories") && (
          <NavLink to="/admin/categories" className="sidebar-link">
            <i className="bi bi-grid"></i>
            <span>Categories</span>
          </NavLink>
        )}

        {canView("orders") && (
          <NavLink to="/admin/orders" className="sidebar-link">
            <i className="bi bi-cart-check"></i>
            <span>Orders</span>
          </NavLink>
        )}

        {canView("customers") && (
          <NavLink to="/admin/customers" className="sidebar-link">
            <i className="bi bi-people"></i>
            <span>Customers</span>
          </NavLink>
        )}

        {canView("reports") && (
          <NavLink to="/admin/reports" className="sidebar-link">
            <i className="bi bi-bar-chart"></i>
            <span>Reports</span>
          </NavLink>
        )}

        {canView("adminManagement") && (
          <NavLink to="/admin/admin-management" className="sidebar-link">
            <i className="bi bi-person-gear"></i>
            <span>Admin Management</span>
          </NavLink>
        )}

        {canView("logsSecurity") && (
          <NavLink to="/admin/logs-security" className="sidebar-link">
            <i className="bi bi-shield-shaded"></i>
            <span>Logs & Security</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="sidebar-link">
          <i className="bi bi-shop"></i>
          <span>Back to Store</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
