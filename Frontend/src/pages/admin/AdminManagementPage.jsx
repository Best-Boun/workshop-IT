import { useEffect, useState } from "react";
import api from "../../api/axios";

const defaultPermissions = {
  manageProducts: false,
  manageOrders: false,
  manageUsers: false,
  viewReports: false,
};

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admins");
      setAdmins(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleTogglePermission = async (adminId, permissionKey) => {
    try {
      setUpdating(adminId);
      const admin = admins.find((item) => item.id === adminId);
      if (!admin) return;

      const nextPermissions = {
        ...defaultPermissions,
        ...(admin.permissions || {}),
        [permissionKey]: !admin.permissions?.[permissionKey],
      };

      await api.put(`/admins/${adminId}/permissions`, {
        permissions: nextPermissions,
      });

      setAdmins((prev) =>
        prev.map((item) =>
          item.id === adminId ? { ...item, permissions: nextPermissions } : item,
        ),
      );
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
      await api.delete(`/admins/${adminId}`);
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
              const permissions = {
                ...defaultPermissions,
                ...(admin.permissions || {}),
              };

              return (
                <tr key={admin.id}>
                  <td>{admin.first_name} {admin.last_name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.role}</td>
                  <td>
                    <div className="d-flex flex-column gap-2">
                      {Object.keys(defaultPermissions).map((permissionKey) => (
                        <div className="form-check" key={permissionKey}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`${admin.id}-${permissionKey}`}
                            checked={permissions[permissionKey]}
                            disabled={updating === admin.id || admin.role === "superadmin"}
                            onChange={() => handleTogglePermission(admin.id, permissionKey)}
                          />
                          <label className="form-check-label" htmlFor={`${admin.id}-${permissionKey}`}>
                            {permissionKey === "manageProducts" && "จัดการสินค้า"}
                            {permissionKey === "manageOrders" && "จัดการคำสั่งซื้อ"}
                            {permissionKey === "manageUsers" && "จัดการผู้ใช้"}
                            {permissionKey === "viewReports" && "ดูรายงาน"}
                          </label>
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
