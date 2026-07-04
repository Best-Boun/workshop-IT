import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <h4>TechPulse</h4>
        <span>Admin Panel</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/admin/dashboard" className="sidebar-link">
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/products" className="sidebar-link">
          <i className="bi bi-box-seam"></i>
          <span>Products</span>
        </NavLink>

        <NavLink to="/admin/categories" className="sidebar-link">
          <i className="bi bi-grid"></i>
          <span>Categories</span>
        </NavLink>

        <NavLink to="/admin/orders" className="sidebar-link">
          <i className="bi bi-cart-check"></i>
          <span>Orders</span>
        </NavLink>

        <NavLink to="/admin/customers" className="sidebar-link">
          <i className="bi bi-people"></i>
          <span>Customers</span>
        </NavLink>

        <NavLink to="/admin/reports" className="sidebar-link">
          <i className="bi bi-bar-chart"></i>
          <span>Reports</span>
        </NavLink>
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
