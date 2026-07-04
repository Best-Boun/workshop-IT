import { Navigate } from "react-router-dom";

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

/**
 * SuperAdminRoute
 * เข้าได้เฉพาะ Super Admin
 */
const SuperAdminRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null",
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "superadmin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export { PrivateRoute, AdminRoute, SuperAdminRoute };
