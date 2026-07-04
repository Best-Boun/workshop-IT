import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../../../utils/storage";
import "./Topbar.css";
import { useTheme } from "../../../context/ThemeContext";

const Topbar = () => {
  const user = getCurrentUser();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/products": "Products",
    "/admin/categories": "Categories",
    "/admin/orders": "Orders",
    "/admin/customers": "Customers",
    "/admin/reports": "Reports",
  };

  const currentTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header className="admin-topbar">
      <div>
        <h3 className="topbar-title">{currentTitle}</h3>

        <p className="topbar-subtitle">
          Welcome back,
          <strong> {user?.first_name || "Admin"}</strong> 👋
        </p>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search..." />
        </div>

        <button className="topbar-icon-btn">
          <i className="bi bi-bell"></i>
        </button>

        <button className="topbar-icon-btn" onClick={toggleTheme}>
          <i className={theme === "light" ? "bi bi-moon" : "bi bi-sun"}></i>
        </button>

        <div className="topbar-profile">
          <div className="profile-avatar">
            {user?.first_name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div>
            <div className="profile-name">{user?.first_name || "Admin"}</div>

            <small>{user?.role || "Administrator"}</small>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
