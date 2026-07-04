import { useEffect, useState } from "react";
import api from "../../api/axios";

const defaultPermissions = {
  dashboard: { view: false, manage: false },
  products: { view: false, manage: false },
  categories: { view: false, manage: false },
  orders: { view: false, manage: false },
  customers: { view: false, manage: false },
  reports: { view: false, manage: false },
  logsSecurity: { view: false, manage: false },
  adminManagement: { view: false, manage: false },
};

const permissionPages = [
  { key: "dashboard", label: "Dashboard" },
  { key: "products", label: "Products" },
  { key: "categories", label: "Categories" },
  { key: "orders", label: "Orders" },
  { key: "customers", label: "Customers" },
  { key: "reports", label: "Reports" },
  { key: "logsSecurity", label: "Logs & Security" },
  { key: "adminManagement", label: "Admin Management" },
];

const normalizePermissions = (permissions) => {
  const base = {
    ...defaultPermissions,
    dashboard: { ...defaultPermissions.dashboard },
    products: { ...defaultPermissions.products },
    categories: { ...defaultPermissions.categories },
    orders: { ...defaultPermissions.orders },
    customers: { ...defaultPermissions.customers },
    reports: { ...defaultPermissions.reports },
    logsSecurity: { ...defaultPermissions.logsSecurity },
    adminManagement: { ...defaultPermissions.adminManagement },
  };

  if (!permissions || typeof permissions !== "object") return base;

  // Backward compatibility for existing old permissions format.
  if (permissions.manageProducts) {
    base.products = { view: true, manage: true };
  }
  if (permissions.manageOrders) {
    base.orders = { view: true, manage: true };
  }
  if (permissions.manageUsers) {
    base.customers = { view: true, manage: true };
    base.adminManagement = { view: true, manage: true };
  }
  if (permissions.viewReports) {
    base.reports = { view: true, manage: false };
  }

  permissionPages.forEach(({ key }) => {
    const value = permissions[key];
    if (value && typeof value === "object") {
      base[key] = {
        view: Boolean(value.view),
        manage: Boolean(value.manage),
      };
    }
  });

  return base;
};

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin");
      setAdmins(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    await loadAdmins();
  };

  useEffect(() => {
    const initAdmins = async () => {
      await loadAdmins();
    };

    void initAdmins();
  }, []);

  const handleTogglePermission = async (adminId, pageKey, permissionType) => {
    try {
      setUpdating(adminId);
      const admin = admins.find((item) => item.id === adminId);
      if (!admin) return;

      const currentPermissions = normalizePermissions(admin.permissions);
      const currentPage = currentPermissions[pageKey] || { view: false, manage: false };
      const nextValue = !currentPage[permissionType];

      const nextPermissions = {
        ...currentPermissions,
        [pageKey]: {
          ...currentPage,
          [permissionType]: nextValue,
          // If manage = true, force view = true
          ...(permissionType === "manage" && nextValue ? { view: true } : {}),
          // If view = false, force manage = false
          ...(permissionType === "view" && !nextValue ? { manage: false } : {}),
        },
      };

      await api.put(`/admin/${adminId}/permissions`, {
        permissions: nextPermissions,
      });

      setAdmins((prev) =>
        prev.map((item) =>
          item.id === adminId ? { ...item, permissions: nextPermissions } : item,
        ),
      );

      const storedUserRaw =
        localStorage.getItem("user") || sessionStorage.getItem("user") || "null";
      const storedUser = JSON.parse(storedUserRaw);

      if (storedUser && storedUser.id === adminId) {
        const updatedUser = { ...storedUser, permissions: nextPermissions };
        if (localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update permissions");
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("ยืนยันการลบแอดมินคนนี้?")) return;

    try {
      setUpdating(adminId);
      await api.delete(`/admin/${adminId}`);
      setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete admin");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h3>จัดการแอดมินย่อย</h3>
          <p className="text-muted">ดูข้อมูลแอดมิน ลบ และอนุมัติสิทธิ์การเข้าถึงฟังก์ชันต่างๆ</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4">{error}</div>
      )}

      <div className="mb-4">
        <button className="btn btn-outline-primary" onClick={fetchAdmins} disabled={loading}>
          {loading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-striped align-middle rounded shadow-sm bg-dark">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>บทบาท</th>
              <th>สิทธิ์การใช้งาน</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => {
              const permissions = normalizePermissions(admin.permissions);

              return (
                <tr key={admin.id}>
                  <td>{admin.first_name} {admin.last_name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.role}</td>
                  <td>
                    <div className="d-flex flex-column gap-2">
                      {permissionPages.map((permissionPage) => (
                        <div
                          key={`${admin.id}-${permissionPage.key}`}
                          className="border rounded p-2"
                        >
                          <div className="fw-semibold mb-1">{permissionPage.label}</div>
                          <div className="d-flex flex-wrap gap-3">
                            <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`${admin.id}-${permissionPage.key}-view`}
                                checked={permissions[permissionPage.key]?.view || false}
                                disabled={updating === admin.id || admin.role === "superadmin"}
                                onChange={() =>
                                  handleTogglePermission(admin.id, permissionPage.key, "view")
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`${admin.id}-${permissionPage.key}-view`}
                              >
                                มองเห็น
                              </label>
                            </div>

                            <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`${admin.id}-${permissionPage.key}-manage`}
                                checked={permissions[permissionPage.key]?.manage || false}
                                disabled={updating === admin.id || admin.role === "superadmin"}
                                onChange={() =>
                                  handleTogglePermission(admin.id, permissionPage.key, "manage")
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`${admin.id}-${permissionPage.key}-manage`}
                              >
                                จัดการ
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      disabled={updating === admin.id || admin.role === "superadmin"}
                      onClick={() => handleDeleteAdmin(admin.id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManagementPage;
