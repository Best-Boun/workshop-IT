import { Navigate } from "react-router-dom";

const pageKeys = [
  "dashboard",
  "products",
  "categories",
  "orders",
  "customers",
  "reports",
  "logsSecurity",
  "adminManagement",
];

const normalizePagePermissions = (permissions) => {
  const base = pageKeys.reduce((acc, key) => {
    acc[key] = { view: false, manage: false };
    return acc;
  }, {});

  const source = permissions && typeof permissions === "object" ? permissions : {};

  // Backward compatibility for legacy flat permissions
  if (source.manageProducts) {
    base.products = { view: true, manage: true };
  }
  if (source.manageOrders) {
    base.orders = { view: true, manage: true };
  }
  if (source.manageUsers) {
    base.customers = { view: true, manage: true };
    base.adminManagement = { view: true, manage: true };
  }
  if (source.viewReports) {
    base.reports = { view: true, manage: false };
  }

  for (const key of pageKeys) {
    const value = source[key];
    if (value && typeof value === "object") {
      base[key] = {
        view: Boolean(value.view),
        manage: Boolean(value.manage),
      };
    }
  }

  return base;
};

const canAccessPage = (user, pageKey, mode = "view") => {
  if (!user) return false;
  if (user.role === "superadmin") return true;

  const hasPagePermissionConfig =
    user.permissions &&
    typeof user.permissions === "object" &&
    pageKeys.some((key) => {
      const value = user.permissions[key];
      return value && typeof value === "object" && ("view" in value || "manage" in value);
    });

  // Existing admins without explicit page config keep full access.
  if (!hasPagePermissionConfig) {
    return true;
  }

  const normalized = normalizePagePermissions(user.permissions);
  const pagePerm = normalized[pageKey];

  if (!pagePerm) return false;
  if (mode === "manage") return pagePerm.manage;

  return pagePerm.view || pagePerm.manage;
};

/**
 * PrivateRoute - ต้อง Login ก่อนเข้า
 */
const PrivateRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * AdminRoute
 * Admin และ Super Admin เข้าได้
 */
const AdminRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin" && user?.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminPageRoute = ({ children, pageKey, mode = "view" }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin" && user?.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  if (!canAccessPage(user, pageKey, mode)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export { PrivateRoute, AdminRoute, AdminPageRoute, canAccessPage };
