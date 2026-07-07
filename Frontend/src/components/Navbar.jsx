import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { clearAuthSession } from "../utils/authSession";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
  );

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.pathname === "/products") {
      const params = new URLSearchParams(location.search);
      setSearchTerm(params.get("q") || "");
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmed = searchTerm.trim();

      if (location.pathname === "/products") {
        const params = new URLSearchParams(location.search);
        const current = (params.get("q") || "").trim();

        if (current === trimmed) return;
      }

      if (!trimmed && location.pathname !== "/products") return;

      const nextSearch = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
      navigate(`/products${nextSearch}`, { replace: true });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, navigate, location.pathname, location.search]);

  const handleLogout = () => {
    clearAuthSession();

    window.location.href = "/login";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    const nextSearch = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
    navigate(`/products${nextSearch}`);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    navigate("/");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleContactClick = (e) => {
    e.preventDefault();

    const footerSection = document.getElementById("contact");

    if (footerSection) {
      footerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="site-navbar navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <div className="container">
        <Link
          className="navbar-brand fw-bold text-primary pe-3"
          to="/"
          onClick={handleLogoClick}
        >
          TechPulse
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="mainNavbar"
        >
          {/* Search */}
          <form
            className="d-none d-lg-flex mx-4 flex-grow-1 search-form"
            onSubmit={handleSearchSubmit}
          >
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                🔍
              </span>

              <input
                type="search"
                className="form-control border-start-0"
                placeholder="Search components, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          <ul className="navbar-nav mb-2 mb-lg-0 align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#about">
                About
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="#contact"
                onClick={handleContactClick}
              >
                Contact
              </a>
            </li>

            <li className="nav-item me-3">
              <Link
                to="/cart"
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 js-cart-target"
              >
                🛒 Cart
              </Link>
            </li>

            {token && user ? (
              <li className="nav-item position-relative" ref={dropdownRef}>
                <button
                  type="button"
                  className={`user-menu-btn ${open ? "active" : ""}`}
                  onClick={() => setOpen(!open)}
                >
                  <div className="user-avatar">
                    {user.first_name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="user-info">
                    <div className="d-flex align-items-center">
                      <span className="user-name">{user.first_name}</span>

                      {user.role === "admin" && (
                        <span className="badge bg-primary ms-2 rounded-pill">
                          ADMIN
                        </span>
                      )}

                      {user.role === "superadmin" && (
                        <span className="badge bg-warning text-dark ms-2 rounded-pill">
                          SUPER
                        </span>
                      )}
                    </div>
                  </div>

                  <i className={`bi bi-chevron-${open ? "up" : "down"}`}></i>
                </button>

                {open && (
                  <div className="user-dropdown">
                    <div className="dropdown-header-user">
                      <div className="user-avatar large">
                        {user.first_name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="fw-bold">
                          {user.first_name} {user.last_name}
                        </div>

                        {user.role === "admin" && (
                          <div className="role-label">🛠 Administrator</div>
                        )}

                        {user.role === "superadmin" && (
                          <span className="badge bg-warning text-dark mt-1">
                            Super Administrator
                          </span>
                        )}

                        <div className="mt-1">
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setOpen(false)}
                    >
                      📦 My Orders
                    </Link>

                    <Link
                      to="/my-account"
                      className="dropdown-item"
                      onClick={() => setOpen(false)}
                    >
                      ⚙️ My Account
                    </Link>

                    {(user.role === "admin" || user.role === "superadmin") && (
                      <>
                        <hr className="dropdown-divider my-2" />

                        <div className="dropdown-section">Administration</div>

                        <Link
                          to="/admin/dashboard"
                          className="dropdown-item d-flex justify-content-between align-items-center"
                          onClick={() => setOpen(false)}
                        >
                          <span>
                            <i className="bi bi-shield-shaded me-2"></i>
                            Admin Console
                          </span>

                          <i className="bi bi-arrow-right-short fs-5"></i>
                        </Link>
                      </>
                    )}

                    <hr className="dropdown-divider my-1" />

                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <div className="vr d-none d-lg-block mx-2"></div>
                </li>

                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold auth-btn auth-outline"
                  >
                    <i className="bi bi-person me-2"></i>
                    Sign In
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold shadow-sm auth-btn auth-primary"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
