import { Navigate } from "react-router-dom";

/**
 * PrivateRoute - ต้อง login ก่อนเข้า
 * ถ้าไม่มี token จะ redirect ไป /login
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
 * AdminRoute - ต้อง login และมี role admin/superadmin
 * ถ้าไม่มี token จะ redirect ไป /login
 * ถ้า role ไม่ใช่ admin จะ redirect ไป /
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

export { PrivateRoute, AdminRoute };
