import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar/Sidebar";
import Topbar from "../components/admin/Topbar/Topbar";

import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Topbar />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
